import { createPropertySelectors } from '@ngxs/store';
import { AUTH_STATE } from './auth';

const authSelectors = createPropertySelectors(AUTH_STATE);

export const isUserSignedIn = authSelectors.signedIn;
export const principal = authSelectors.userInfo;
