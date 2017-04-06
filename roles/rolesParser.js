const rolesParser  = {}

rolesParser.isEditingAllowed = tokenParsed => {

  if (!tokenParsed || !tokenParsed.roles) return false

  let isEditingAllowed = false

  tokenParsed.roles.forEach( roleString => {
    let roleJSON = JSON.parse(roleString)
    if (roleJSON.r === 'editStops') {
      isEditingAllowed = true
    }
  })
  return isEditingAllowed
}

export default rolesParser