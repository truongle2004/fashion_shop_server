const getEnv = () => {
  return process.env.RUNNING_ENV
}

export const IS_DEV = getEnv() === 'dev'
