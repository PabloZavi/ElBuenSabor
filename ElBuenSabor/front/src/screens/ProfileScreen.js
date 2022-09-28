import React, { useContext } from 'react'
import { Store } from '../Store';

export default function ProfileScreen() {
    const { state, dispatch: ctxDispatch } = useContext(Store);
  const { userInfo } = state;

  return (
    <div>ProfileScreen</div>
  )
}
