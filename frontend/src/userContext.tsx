import { createContext, useState, ReactNode, Dispatch, SetStateAction, FC } from "react";

export interface User {
  id: string;
  email: string;
  name?: string;
}

interface UserContextType {
  userInfo: User | null;
  setUserInfo: Dispatch<SetStateAction<User | null>>;
}

export const UserContext = createContext<UserContextType>({
  userInfo: null,
  setUserInfo: () => {},
});

interface UserContextProviderProps {
  children: ReactNode;
}

export const UserContextProvider: FC<UserContextProviderProps> = ({ children }) => {
  const [userInfo, setUserInfo] = useState<User | null>(null);

  return (
    <UserContext.Provider value={{ userInfo, setUserInfo }}>
      {children}
    </UserContext.Provider>
  );
};
