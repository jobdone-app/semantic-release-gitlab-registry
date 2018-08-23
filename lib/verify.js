const execa = require('execa')

module.exports = async (pluginConfig, { logger }) => {
  for (const envVar of ['CI_REGISTRY_USER', 'CI_REGISTRY_PASSWORD', 'CI_REGISTRY']) {
    if (!process.env[envVar]) {
      throw new Error(`Environment variable ${envVar} is not set`)
    }
  }
  try {
    await execa(
      'docker',
      [
        'login',
        '-u=' + process.env.CI_REGISTRY_USER,
        '-p=' + process.env.CI_REGISTRY_PASSWORD,
        process.env.CI_REGISTRY,
      ],
      { stdio: 'inherit' }
    )
  } catch (err) {
    throw new Error('docker login failed')
  }
}
