const execa = require('execa')

/**
 * @typedef {import('./index').Context} Context
 */
/**
 * Push new docker image.
 *
 * @param {Object} pluginConfig - The plugin configuration.
 * @param {Context} context - The semantic-release context.
 * @returns {Promise} A `Promise` that resolve to docker push command.
 */
module.exports = async (pluginConfig, { nextRelease: { version }, logger }) => {
  try {
    logger.log(
      `Pushing version ${
        process.env.CI_REGISTRY_IMAGE
      }:${version} to GitLab Container Registry`
    )

    // Push both new version and latest
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
    await execa(
      'docker',
      ['push', `${process.env.CI_REGISTRY_IMAGE}:${version}`],
      { stdio: 'inherit' }
    )
    await execa('docker', ['push', `${process.env.CI_REGISTRY_IMAGE}:latest`], {
      stdio: 'inherit'
    })
  } catch (err) {
    throw new Error('docker push failed')
  }
}
