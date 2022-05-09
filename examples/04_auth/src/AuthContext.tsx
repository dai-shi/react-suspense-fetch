import React, {
  ReactNode,
  createContext,
  useContext,
  useState,
} from 'react';

const useAuthState = () => useState<({ getToken: () => string }) | null>(null);

const AuthContext = createContext<ReturnType<typeof useAuthState>>([
  null,
  () => { throw new Error('uninitialized'); },
]);

export const AuthContextProvider = ({ children }: { children: ReactNode }) => (
  <AuthContext.Provider value={useAuthState()}>
    {children}
  </AuthContext.Provider>
);

export const useAuthContext = () => useContext(AuthContext);
