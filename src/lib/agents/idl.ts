export const IDL = {
  version: "0.1.0",
  name: "agent_program",
  instructions: [
    {
      name: "createAgent",
      accounts: [
        {
          name: "agent",
          isMut: true,
          isSigner: false
        },
        {
          name: "owner",
          isMut: true,
          isSigner: true
        },
        {
          name: "metadata",
          isMut: false,
          isSigner: false
        },
        {
          name: "systemProgram",
          isMut: false,
          isSigner: false
        }
      ],
      args: []
    }
  ],
  accounts: [
    {
      name: "Agent",
      type: {
        kind: "struct",
        fields: [
          {
            name: "owner",
            type: "publicKey"
          },
          {
            name: "metadata",
            type: "publicKey"
          },
          {
            name: "lastAction",
            type: "i64"
          },
          {
            name: "experience",
            type: "u64"
          },
          {
            name: "level",
            type: "u8"
          },
          {
            name: "status",
            type: "u8"
          }
        ]
      }
    }
  ]
};