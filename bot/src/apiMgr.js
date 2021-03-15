const { ApolloClient } = require('apollo-client')
const { InMemoryCache } = require('apollo-cache-inmemory')
const { HttpLink } = require('apollo-link-http')
const fetch = require('cross-fetch')
const {
  userByDiscordId,
  rolesByUserAndGuild,
} = require('./graphql-operations/queries')
const { updateRole } = require('./graphql-operations/mutations')

class ApiMgr {
  constructor() {
    const debug = true
    const cache = new InMemoryCache()
    const link = new HttpLink({
      uri: process.env.API_URL,
      fetch,
    })
    this.client = new ApolloClient({
      link,
      cache,
      onError: (e) => {
        debug && console.log(e)
      },
      defaultOptions: {
        query: {
          fetchPolicy: 'network-only',
        },
      },
    })
  }

  async getRolesByUserAndGuild({ discordId, guildId }) {
    if (!discordId || !guildId) throw new Error('no discordId or guildId')
    try {
      const res = this.client.query({
        query: rolesByUserAndGuild,
        variables: { discordId, guildId },
      })
      return { roles: res.data.userRolesForGuild.roles }
    } catch (e) {
      console.log(e)
      return { error: e }
    }
  }

  async getNfts(discordId) {
    if (!discordId) throw new Error('no discordId')
    try {
      const user = await this.client.query({
        query: userByDiscordId,
        variables: { discordId },
      })
      return { nfts: user.data.userByDiscordId.nfts }
    } catch (e) {
      console.log(e)
      return { error: e }
    }
  }

  async updateRole(input) {
    try {
      await this.client.mutate({
        mutation: updateRole,
        variables: { ...input },
      })
    } catch (e) {
      console.log(e)
      throw new Error(e)
      // return { error: e }
    }
  }
}

module.exports = ApiMgr
