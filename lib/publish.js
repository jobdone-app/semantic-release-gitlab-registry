const execa = require('execa')
const semver = require('semver/preload.js')

/**
 * @typedef {import('./index').Context} Context
 */
/**
 * Tag and push new docker images with semantic versioning.
 *
 * @param {Object} pluginConfig - The plugin configuration.
 * @param {Context} context - The semantic-release context.
 * @returns {Promise} A `Promise` that resolve to docker push command.
 */
module.exports = async (pluginConfig, { nextRelease: { version }, logger }) => {
  /**
   * Tag and push docker image by version.
   *
   * @param {string} version - Tag version.
   * @returns {Promise} A `Promise` that resolve to docker push command.
   */
  async function publish (version) {
    logger.log(
      `Pushing version ${
        process.env.CI_REGISTRY_IMAGE
      }:${version} to GitLab Container Registry`
    )
    // tag image if not latest
    if (version !== 'latest') {
      await execa(
        'docker',
        [
          'tag',
          `${process.env.CI_REGISTRY_IMAGE}:latest`,
          `${process.env.CI_REGISTRY_IMAGE}:${version}`
        ],
        {
          stdio: 'inherit'
        }
      )
    }
    // push image
    await execa(
      'docker',
      ['push', `${process.env.CI_REGISTRY_IMAGE}:${version}`],
      { stdio: 'inherit' }
    )
  }

  try {
    // parse version to parts
    const prerelease = semver.prerelease(version)
    let isProdRelease = false

    // check if prerelease
    if (!prerelease || !prerelease.length) {
      isProdRelease = true
    }
    logger.log(`isProdRelease: ${isProdRelease}`)

    // first release version as it is X:1.1.1
    await publish(version)

    if (isProdRelease) {
      // on production release X:latest
      await publish('latest')

      return
    } else {
      const [channel] = prerelease

      // on other channels release X:channel
      await publish(channel)
    }
  } catch (err) {
    throw new Error(`docker push failed: ${err}`)
  }
}
