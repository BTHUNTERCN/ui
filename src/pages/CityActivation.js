import { useAtom } from 'jotai';
import RegisterUser from '../components/activation/RegisterUser';
import NoCitySelected from '../components/common/NoCitySelected';
import Unauthorized from '../components/common/Unauthorized';
import { currentCityAtom } from '../store/cities';
import { loginStatusAtom } from '../store/stacks';

export default function CityActivation() {
  const [loginStatus] = useAtom(loginStatusAtom);
  const [currentCity] = useAtom(currentCityAtom);

  return !currentCity.loaded ? (
    <NoCitySelected />
  ) : loginStatus ? (
    <RegisterUser />
  ) : (
    <Unauthorized />
  );
}
