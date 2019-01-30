const execa = require('execa')

module.exports = async (pluginConfig, { nextRelease: { version }, logger }) => {
  try {
    logger.log(`Pushing version ${process.env.CI_REGISTRY_IMAGE}:${version} to GitLab Container Registry`)

    // Push both new version and latest
    await execa('docker', ['tag', `${process.env.CI_REGISTRY_IMAGE}:latest`, `${process.env.CI_REGISTRY_IMAGE}:${version}`], {
      stdio: 'inherit',
    })
    await execa('docker', ['push', `${process.env.CI_REGISTRY_IMAGE}:${version}`], { stdio: 'inherit' })
    await execa('docker', ['push', `${process.env.CI_REGISTRY_IMAGE}:latest`], { stdio: 'inherit' })
  } catch (err) {
    throw new Error('docker push failed')
  }
}
