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

import { Component } from "react";
import Tag from "./Tag";

class TagTray extends Component {
  render() {
    const { tags, textSize, direction, align, style } = this.props;
    const wrapperStyle = {
      display: "flex",
      alignItems: align || "center",
      flexDirection: direction || "row",
      ...style,
    };

    return (
      <div style={wrapperStyle}>
        {tags &&
          tags.map((tag, i) => (
            <Tag textSize={textSize} key={"tag-" + i} data={tag} />
          ))}
      </div>
    );
  }
}

export default TagTray;
