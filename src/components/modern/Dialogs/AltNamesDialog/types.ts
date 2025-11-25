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

/**
 * Alternative name structure
 */
export interface AlternativeName {
  name: {
    value: string;
    lang: string;
  };
  nameType: string;
}

/**
 * Props for the main AltNamesDialog
 */
export interface AltNamesDialogProps {
  open: boolean;
  handleClose: () => void;
  altNames: AlternativeName[];
  disabled?: boolean;
}

/**
 * State for editing/adding alternative names
 */
export interface EditingState {
  isEditing: boolean;
  editingId: number | null;
  lang: string;
  value: string;
  type: string;
}

/**
 * Pending operation for conflict resolution
 */
export interface PendingOperation {
  payload: any;
  removeIndex: number;
}
