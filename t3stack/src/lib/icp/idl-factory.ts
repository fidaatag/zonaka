/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-explicit-any */


export const idlFactory = ({ IDL }: any) => {
  return IDL.Service({
    // Define your canister methods here
    // Example: greet: IDL.Func([IDL.Text], [IDL.Text], []),
    greet : IDL.Func([IDL.Text], [IDL.Text], ['query'])
  });
};