import React from 'react'
import Checkbox from 'material-ui/Checkbox'
import Popover from 'material-ui/Popover'
import RaisedButton from 'material-ui/RaisedButton'
import Divider from 'material-ui/Divider'

class FilterPopover extends React.Component {

    constructor(props) {
      super(props)
      this.state = {
        open: false
      }
    }

    handleRequestClose(refs) {

      let switchedTypes = []

      for (let key in refs) {
        let ref = refs[key]
        if (ref.state.switched && ref.props.value) {
          switchedTypes.push(ref.props.value)
        }
      }
      // if all options are selected, no filters should be applied for this key
      if (switchedTypes.length == this.props.items.length) {
        switchedTypes = []
      }

      this.setState({
        open: false
      })

      this.props.onDismiss(switchedTypes)
    }

    handleTouchTap(event) {
      event.preventDefault()

      this.setState({
        open: true,
        anchorEl: event.currentTarget,
      })
    }

    handleCheck(refs, {state}) {

      const allChecked = refs["checkbox-all"].state.switched

      if (state.switched && allChecked) {
        refs["checkbox-all"].setState({
          switched: false
        })
      }
    }

    checkAllBoxes(refs) {

      const value = refs["checkbox-all"].state.switched

      if (!value) {
        for (let key in refs) {
          var ref = refs[key]
          ref.setState({
            switched: true
          })
        }
      }
    }

    render() {

      const { items, filter, caption, allLabel } = this.props

      const allTypesChecked = !filter.length

      const checkboxStyle = {
        margin: 16,
        width: 160,
        overflowY: "hidden"
      }

      const popoverstyle = {
        width: 180,
        overflowY: "hidden"
      }

      const buttonStyle = {
        borderBottom: "1px dotted #000",
        marginBottom: 5
      }

      return (
        <div>
          <RaisedButton
            onTouchTap={this.handleTouchTap.bind(this)}
            label={caption}
            style={buttonStyle}
            />
          <Popover
           open={this.state.open}
           anchorEl={this.state.anchorEl}
           anchorOrigin={{horizontal: 'left', vertical: 'bottom'}}
           targetOrigin={{horizontal: 'left', vertical: 'top'}}
           onRequestClose={ () => this.handleRequestClose(this.refs)}
           style={popoverstyle}
           >

           { items.map( (item, index) => (
             <Checkbox
               key={"chbox-popover-" + index}
               ref={"cbref"+index}
               label={item.name}
               defaultChecked={allTypesChecked || (filter.indexOf(item.value) > -1)}
               onCheck={() => this.handleCheck(this.refs, this.refs["cbref"+index])}
               labelPosition="left"
               value={item.value}
               style={checkboxStyle}
               />
            ))}
            <Divider />
            <Checkbox
              ref="checkbox-all"
              defaultChecked={allTypesChecked}
              onCheck={() => this.checkAllBoxes(this.refs)}
              label={allLabel}
              labelPosition="left"
              style={checkboxStyle}
              />
            </Popover>
        </div>
      )
    }
}

export default FilterPopover
