/*
 *  Licensed under the EUPL, Version 1.2 or – as soon they will be approved by
the European Commission - subsequent versions of the EUPL (the "Licence");
You may not use this work except in compliance with the Licence.
You may obtain a copy of the Licence at:

  https://joinup.ec.europa.eu/software/page/eupl

Unless required by applicable law or agreed to in writing, software
distributed under the Licence is distributed on an "AS IS" basis,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the Licence for the specific language governing permissions and
limitations under the Licence. */

import { Action, Transition } from "history";
import { useCallback, useEffect, useRef, useState } from "react";
import { useStore } from "react-redux";
import {
  StopPlaceActions,
  StopPlacesGroupActions,
} from "../../../../../actions";
import { useAppDispatch, useAppSelector } from "../../../../../store/hooks";
import { browserHistory, RootState } from "../../../../../store/store";
import type { ConfirmLeave } from "../UnsavedChangesGuardContext";
import { findUnsavedEditor, UnsavedEditor } from "../unsavedEditor";

export interface LeaveGuard {
  /** The editor whose changes would be lost, while the user is being asked. */
  pendingEditor: UnsavedEditor | null;
  confirmLeave: ConfirmLeave;
  discardAndLeave: () => void;
  stay: () => void;
}

/**
 * One guard for every way of leaving an editor with unsaved changes (F-31).
 *
 * - In-app callers use `confirmLeave` to ask before they start any work.
 * - Anything else (popup links, header tabs, back/forward, reload, closing the
 *   tab) is caught by history.block() while there are unsaved changes. The app
 *   is not on a data router, so react-router's useBlocker isn't available.
 *
 * Dirty state is read at the moment of navigating, so a flow that discards
 * and then navigates (the editors' own Close dialog) passes straight through.
 */
export const useLeaveGuard = (): LeaveGuard => {
  const store = useStore<RootState>();
  const dispatch = useAppDispatch();
  const [pendingEditor, setPendingEditor] = useState<UnsavedEditor | null>(
    null,
  );
  const pendingLeaveRef = useRef<(() => void) | null>(null);

  const hasUnsavedChanges = useAppSelector(
    (state) =>
      findUnsavedEditor(state, state.router.location?.pathname ?? "") !== null,
  );

  const findEditorToGuard = useCallback(
    () => findUnsavedEditor(store.getState(), browserHistory.location.pathname),
    [store],
  );

  const askBeforeLeaving = useCallback(
    (editor: UnsavedEditor, leave: () => void) => {
      pendingLeaveRef.current = leave;
      setPendingEditor(editor);
    },
    [],
  );

  const confirmLeave = useCallback<ConfirmLeave>(
    (leave) => {
      const editor = findEditorToGuard();
      if (!editor) {
        leave();
        return;
      }
      askBeforeLeaving(editor, leave);
    },
    [findEditorToGuard, askBeforeLeaving],
  );

  useEffect(() => {
    if (!hasUnsavedChanges) return;

    const handleTransition = (transition: Transition) => {
      // A POP retry replays go(delta) asynchronously, so re-blocking right away
      // would revert it again; the effect re-registers if still needed.
      const proceed = () => {
        unblock();
        transition.retry();
        if (transition.action !== Action.Pop) {
          unblock = browserHistory.block(handleTransition);
        }
      };
      const editor = findEditorToGuard();
      const isSamePath =
        transition.location.pathname === browserHistory.location.pathname;
      if (!editor || isSamePath) {
        proceed();
        return;
      }
      askBeforeLeaving(editor, proceed);
    };

    /* history.block() can't revert "back" onto an entry created outside the
       history library (raw pushState/replaceState with no index, e.g. legacy
       URLhelpers or the login callback); it gives up and leaves the URL
       changed under an unchanged editor. Put the editor's entry back, then
       ask; Discard navigates there through the history library. */
    const editorState = window.history.state;
    const editorUrl = `${window.location.pathname}${window.location.search}`;
    const handleUnindexedPop = () => {
      if (window.history.state?.idx != null) return;
      const editor = findEditorToGuard();
      if (!editor) return;
      const leftForUrl = `${window.location.pathname}${window.location.search}`;
      window.history.pushState(editorState, "", editorUrl);
      askBeforeLeaving(editor, () => {
        unblock();
        browserHistory.push(leftForUrl);
      });
    };

    let unblock = browserHistory.block(handleTransition);
    window.addEventListener("popstate", handleUnindexedPop);
    return () => {
      unblock();
      window.removeEventListener("popstate", handleUnindexedPop);
    };
  }, [hasUnsavedChanges, findEditorToGuard, askBeforeLeaving]);

  const closePrompt = useCallback(() => {
    const leave = pendingLeaveRef.current;
    pendingLeaveRef.current = null;
    setPendingEditor(null);
    return leave;
  }, []);

  const discardAndLeave = useCallback(() => {
    dispatch(
      pendingEditor === "group"
        ? StopPlacesGroupActions.discardChanges()
        : StopPlaceActions.discardChangesForEditingStop(),
    );
    closePrompt()?.();
  }, [dispatch, pendingEditor, closePrompt]);

  const stay = useCallback(() => {
    closePrompt();
  }, [closePrompt]);

  return { pendingEditor, confirmLeave, discardAndLeave, stay };
};
