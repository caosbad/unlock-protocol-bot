export const schema = gql`
  type Role {
    id: String!
    guild: Guild!
    name: String!
    platformId: String!
    description: String
    token: Token!
    balance: String!
    users: [User]!
    guildPlatformId: String!
    tokenId: String!
  }

  type Query {
    roles: [Role!]!
  }

  input CreateRoleInput {
    name: String!
    platformId: String!
    description: String
    balance: String!
    guildPlatformId: String!
    tokenId: String!
  }

  input UpdateRoleInput {
    name: String
    platformId: String
    description: String
    balance: String
    guildPlatformId: String
    tokenId: String
  }
`
