import { BigNumberish, BigNumber as EtherBN } from 'ethers'
import BigNumber from 'bignumber.js'

export type BN = BigNumber

export const PERCENTAGE_FACTOR = '100'
export const ONE_HUNDRED_PERCENTAGE_FACTOR = '10000'
export const HALF_PERCENTAGE = '5000'
export const WAD = (10 ** 18).toString()
export const HALF_WAD = new BigNumber(WAD).multipliedBy(0.5).toString()
export const RAY = new BigNumber(10).exponentiatedBy(27).toFixed()
export const HALF_RAY = new BigNumber(RAY).multipliedBy(0.5).toFixed()
export const WAD_RAY_RATIO = (10 ** 9).toString()
export const oneEther = new BigNumber(10 ** 18)
export const oneRay = new BigNumber(10 ** 27)
export const MAX_UINT_AMOUNT = '115792089237316195423570985008687907853269984665640564039457584007913129639935'
export const ONE_YEAR = '31536000'
export const ONE_HOUR = '3600'

export const bn = (n: BigNumber.Value) => new BigNumber(n)
export const ray = (n: BigNumber.Value) => bn(RAY).multipliedBy(n)
export const percent = (n: BigNumber.Value) => bn(PERCENTAGE_FACTOR).multipliedBy(n)
export const wad = (n: BigNumber.Value) => bn(WAD).multipliedBy(n)
export const amount = (n: BigNumber.Value, decimals = 18) => bn(10).pow(decimals).multipliedBy(n)
export const toBN = (value: BigNumberish) => bn(EtherBN.from(value).toString())

export const binomCompound = (num: BigNumber, periods: BigNumber.Value, binoms: number = 5): BigNumber => {
  const exp = bn(periods)
  if (exp.eq(0)) return ray(0)

  const rate = ray(num)
  let el = rate.mul(exp)
  let result = ray(1).add(el)

  for (let i = 1; i < binoms; i++) {
    if (exp.lte(i)) break

    el = el
      .mul(exp.sub(i))
      .rayMul(rate)
      .div(i + 1)

    result = result.add(el)
  }

  return result.fromDecimals(9)
}

declare module 'bignumber.js' {
  interface BigNumber {
    str: () => string
    fromDecimals: (decimals?: number) => BigNumber
    toDecimals: (decimals?: number) => BigNumber
    human: (decimals?: number, digits?: number) => string
    ray: () => BigNumber
    wad: () => BigNumber
    halfRay: () => BigNumber
    halfWad: () => BigNumber
    halfPercentage: () => BigNumber
    wadMul: (a: BigNumber) => BigNumber
    wadDiv: (a: BigNumber) => BigNumber
    rayMul: (a: BigNumber) => BigNumber
    rayDiv: (a: BigNumber) => BigNumber
    percentMul: (a: BigNumber) => BigNumber
    percentDiv: (a: BigNumber) => BigNumber
    rayToWad: () => BigNumber
    wadToRay: () => BigNumber
    fromRay: (decimals?: number) => BigNumber
    toRay: (decimals?: number) => BigNumber

    sub: (n: BigNumber.Value) => BigNumber
    add: (n: BigNumber.Value) => BigNumber
    mul: (n: BigNumber.Value) => BigNumber
  }
}

BigNumber.prototype.str = function str(): string {
  return this.decimalPlaces(0, BigNumber.ROUND_DOWN).toFixed()
}

BigNumber.prototype.fromDecimals = function fromDecimals(decimals: number = 18): BigNumber {
  return this.decimalPlaces(decimals, BigNumber.ROUND_DOWN).div(new BigNumber(10).pow(decimals))
}

BigNumber.prototype.toDecimals = function toDecimals(decimals: number = 18): BigNumber {
  return this.mul(new BigNumber(10).pow(decimals)).decimalPlaces(0, BigNumber.ROUND_DOWN)
}

BigNumber.prototype.human = function human(decimals: number = 18, digits: number = decimals): string {
  return this.fromDecimals(decimals).decimalPlaces(digits).toFixed()
}

BigNumber.prototype.ray = function ray(): BigNumber {
  return new BigNumber(RAY).decimalPlaces(0)
}
BigNumber.prototype.wad = function wad(): BigNumber {
  return new BigNumber(WAD).decimalPlaces(0)
}

BigNumber.prototype.halfRay = function halfRay(): BigNumber {
  return new BigNumber(HALF_RAY).decimalPlaces(0, BigNumber.ROUND_DOWN)
}

BigNumber.prototype.halfWad = function halfWad(): BigNumber {
  return new BigNumber(HALF_WAD).decimalPlaces(0, BigNumber.ROUND_DOWN)
}

BigNumber.prototype.halfPercentage = function halfPercentage(): BigNumber {
  return new BigNumber(HALF_PERCENTAGE).decimalPlaces(0, BigNumber.ROUND_DOWN)
}

BigNumber.prototype.wadMul = function wadMul(b: BigNumber): BigNumber {
  return this.halfWad().plus(this.multipliedBy(b)).div(WAD).decimalPlaces(0, BigNumber.ROUND_DOWN)
}

BigNumber.prototype.wadDiv = function wadDiv(a: BigNumber): BigNumber {
  const halfA = a.div(2).decimalPlaces(0, BigNumber.ROUND_DOWN)

  return halfA.plus(this.multipliedBy(WAD)).div(a).decimalPlaces(0, BigNumber.ROUND_DOWN)
}

BigNumber.prototype.rayMul = function rayMul(a: BigNumber): BigNumber {
  return this.halfRay().plus(this.multipliedBy(a)).div(RAY).decimalPlaces(0, BigNumber.ROUND_DOWN)
}

BigNumber.prototype.rayDiv = function rayDiv(a: BigNumber): BigNumber {
  const halfA = a.div(2).decimalPlaces(0, BigNumber.ROUND_DOWN)

  return halfA
    .plus(this.multipliedBy(RAY))
    .decimalPlaces(0, BigNumber.ROUND_DOWN)
    .div(a)
    .decimalPlaces(0, BigNumber.ROUND_DOWN)
}

BigNumber.prototype.percentMul = function percentMul(b: BigNumber): BigNumber {
  return this.multipliedBy(b)
    .plus(HALF_PERCENTAGE)
    .div(ONE_HUNDRED_PERCENTAGE_FACTOR)
    .decimalPlaces(0, BigNumber.ROUND_DOWN)
}

BigNumber.prototype.percentDiv = function percentDiv(a: BigNumber): BigNumber {
  const halfA = a.div(2).decimalPlaces(0, BigNumber.ROUND_DOWN)

  return halfA.plus(this.multipliedBy(ONE_HUNDRED_PERCENTAGE_FACTOR)).div(a).decimalPlaces(0, BigNumber.ROUND_DOWN)
}

BigNumber.prototype.wadToRay = function wadToRay(): BigNumber {
  return this.multipliedBy(WAD_RAY_RATIO).decimalPlaces(0, BigNumber.ROUND_DOWN)
}

BigNumber.prototype.rayToWad = function rayToWad(): BigNumber {
  const halfRatio = new BigNumber(WAD_RAY_RATIO).div(2)

  return halfRatio.plus(this).div(WAD_RAY_RATIO).decimalPlaces(0, BigNumber.ROUND_DOWN)
}

BigNumber.prototype.fromRay = function fromRay(decimals: number = 27): BigNumber {
  return this.fromDecimals(decimals)
}

BigNumber.prototype.toRay = function toRay(decimals: number = 27): BigNumber {
  return this.toDecimals(decimals)
}

BigNumber.prototype.sub = function sub(n: BigNumber.Value): BigNumber {
  return this.minus(n)
}

BigNumber.prototype.add = function add(n: BigNumber.Value): BigNumber {
  return this.plus(n)
}

BigNumber.prototype.mul = function mul(n: BigNumber.Value): BigNumber {
  return this.multipliedBy(n)
}

export default BigNumber
