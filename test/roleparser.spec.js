import expect from 'expect'
import roleParser from '../roles/rolesParser'
import tokenCanEdit from './mock/tokenParsedEdit'
import tokenOnlyRead from './mock/tokenParsedOnlyRead'

describe('role parser', () => {

  it('should understand whether user can edit stop given the correct role', () => {

    const canEdit = roleParser.canEdit(tokenCanEdit)
    expect(canEdit).toEqual(true)

    const canOnlyRead = roleParser.canEdit(tokenOnlyRead)
    expect(canOnlyRead).toEqual(false)

  })

})
