import { useCallback } from 'react';
import { AppConfig, UserSession } from '@stacks/connect-react';
import { showConnect } from '@stacks/connect';
import { atom, useAtom } from 'jotai';
import { useUpdateAtom } from 'jotai/utils';
import { userAppStxAddress, userBnsName, userLoggedIn, userStxAddress } from '../store/stacks';

const appConfig = new AppConfig(['store_write', 'publish_data']);
export const userSessionState = atom(new UserSession({ appConfig }));
export const userDataState = atom();
export const authResponseState = atom();

export const useConnect = () => {
  const [userSession] = useAtom(userSessionState);
  const setUserData = useUpdateAtom(userDataState);
  const setAuthResponse = useUpdateAtom(authResponseState);
  const setLoggedIn = useUpdateAtom(userLoggedIn);
  const setStxAddress = useUpdateAtom(userStxAddress);
  const setAppStxAddress = useUpdateAtom(userAppStxAddress);
  const setBnsName = useUpdateAtom(userBnsName);

  const onFinish = async payload => {
    setAuthResponse(payload.authResponse);
    const userData = await payload.userSession.loadUserData();
    setUserData(userData);
    setLoggedIn(true);
  };

  const authOptions = {
    onFinish,
    userSession, // usersession is already in state, provide it here
    redirectTo: '/',
    manifestPath: '/manifest.json',
    appDetails: {
      name: 'CityCoins',
      icon: 'https://minecitycoins.com/CityCoins_Logo_150x150.png',
    },
  };

  const handleOpenAuth = () => {
    showConnect(authOptions);
  };

  const handleSignOut = useCallback(() => {
    setLoggedIn(false);
    setStxAddress('');
    setAppStxAddress('');
    setBnsName('');
    userSession?.signUserOut('/');
  }, [setAppStxAddress, setBnsName, setLoggedIn, setStxAddress, userSession]);

  return { handleOpenAuth, handleSignOut, authOptions };
};
