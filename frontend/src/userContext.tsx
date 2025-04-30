import React, { createContext, useState, ReactNode, Dispatch, SetStateAction, FC } from "react";

// 1) Define a concrete User shape (edit fields to match your app)
export interface User {
  id: string;
  email: string;
  name?: string;
}

// 2) Shape of our context value
interface UserContextType {
  userInfo: User | null;
  setUserInfo: Dispatch<SetStateAction<User | null>>;
}

// 3) Create the context with a default value so useContext never returns undefined
export const UserContext = createContext<UserContextType>({
  userInfo: null,
  setUserInfo: () => {},
});

// 4) Props for our provider
interface UserContextProviderProps {
  children: ReactNode;
}

// 5) The provider component
export const UserContextProvider: FC<UserContextProviderProps> = ({ children }) => {
  const [userInfo, setUserInfo] = useState<User | null>(null);

  return (
    <UserContext.Provider value={{ userInfo, setUserInfo }}>
      {children}
    </UserContext.Provider>
  );
};
