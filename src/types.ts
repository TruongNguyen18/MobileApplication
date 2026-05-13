export type RootStackParamList = {
  Home: undefined;
  Calendar: undefined;
  AddTransaction: undefined;
  EditCategory: { type?: "expense" | "income" } | undefined;
};
