
const userID = 'user24'

import { genTestUserSig } from '../../../public/debug/GenerateTestUserSig'
const user = {
    state: {
        currentUserProfile: '',
        userID: userID,
        userSig: genTestUserSig(userID).userSig, 
        sdkAppID: genTestUserSig('').sdkAppID,
    }
}

export default user