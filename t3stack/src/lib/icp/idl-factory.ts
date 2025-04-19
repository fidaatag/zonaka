export const idlFactory = ({ IDL }: any) => {
  return IDL.Service({
    // Define your canister methods here
    // Example: greet: IDL.Func([IDL.Text], [IDL.Text], []),
    greet : IDL.Func([IDL.Text], [IDL.Text], ['query'])
  });
};