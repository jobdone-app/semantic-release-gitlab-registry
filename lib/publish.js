const execa = require('execa')

module.exports = async (pluginConfig, { nextRelease: { version }, logger }) => {
  logger.log(`Pushing version ${process.env.CI_REGISTRY_IMAGE}:${version} to GitLab Container Registry`)

  // Push both new version and latest
  execa('docker', ['tag', `${process.env.CI_REGISTRY_IMAGE}:latest`, `${process.env.CI_REGISTRY_IMAGE}:${version}`], {
    stdio: 'inherit',
  })
  execa('docker', ['push', `${process.env.CI_REGISTRY_IMAGE}:${version}`], { stdio: 'inherit' })
  execa('docker', ['push', `${process.env.CI_REGISTRY_IMAGE}:latest`], { stdio: 'inherit' })
}
