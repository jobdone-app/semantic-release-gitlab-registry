# semantic-release-gitlab-registry

[![npm](https://img.shields.io/npm/v/semantic-release-gitlab-registry.svg)](https://www.npmjs.com/package/lgaticaq/semantic-release-gitlab-registry)
[![build](https://img.shields.io/travis/lgaticaq/semantic-release-gitlab-registry.svg)](https://travis-ci.org/lgaticaq/semantic-release-gitlab-registry)
[![downloads](https://img.shields.io/npm/dt/semantic-release-gitlab-registry.svg)](https://www.npmjs.com/package/semantic-release-gitlab-registry)
[![dependencies](https://img.shields.io/david/lgaticaq/semantic-release-gitlab-registry.svg)](https://david-dm.org/lgaticaq/semantic-release-gitlab-registry)
[![peerDependencies](https://david-dm.org/lgaticaq/semantic-release-gitlab-registry/peer-status.svg)](https://david-dm.org/lgaticaq/semantic-release-gitlab-registry?type=peer)
[![Greenkeeper](https://badges.greenkeeper.io/lgaticaq/semantic-release-gitlab-registry.svg)](https://greenkeeper.io/)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg)](https://github.com/prettier/prettier)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)
[![license](https://img.shields.io/npm/l/semantic-release-gitlab-registry.svg)](https://github.com/lgaticaq/semantic-release-gitlab-registry/blob/master/LICENSE)

Set of [semantic-release](https://github.com/semantic-release/semantic-release) plugins for publishing a docker image to [GitLab Container Registry](https://docs.gitlab.com/ce/user/project/container_registry.html).

```json
{
  "release": {
    "verifyConditions": "semantic-release-gitlab-registry",
    "publish": {
      "path": "semantic-release-gitlab-registry",
      "name": "username/imagename"
    }
  }
}
```

## Plugins

### `verifyConditions`

Verify that all needed configuration is present and login to the GitLab Container Registry.

### `publish`

Tag the image with the new version, push it to GitLab Container Registry and update the `latest` tag.

## Example .gitlab-ci.yml

```yml
stages:
  - test
  - release

test:
  image: node:alpine
  stage: test
  before_script:
    - npm i
  script:
    - npm t

release:
  image: node:alpine
  stage: release
  before_script:
    - npm i
    - docker build -t $CI_REGISTRY_IMAGE .
  script:
    - npx semantic-release
  only:
    - master
```
