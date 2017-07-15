import { execFile } from 'child_process'
import { basename, extname, dirname } from 'path'

type ExecFn = typeof execFile

/**
 * Converts document to mobi format
 * @param [string] inputFilePath - Path to the input file
 * @param [string] outputFilename - The output filename
 * @param [string] outputFilename - The output filename
 * @return [string] Path to the output path
 */
export default function convert(
  inputFilePath: string,
  outputFilename: string = `${basename(inputFilePath, extname(inputFilePath))}.mobi`,
  exec: ExecFn = execFile
): Promise<string> {
  return new Promise((resolve, reject) => {
    exec('./kindlegen', [inputFilePath, '-o', outputFilename], (err) => {
      if (err != null) {
        reject(err)
      } else {
        resolve(`${dirname(inputFilePath)}/${outputFilename}`)
      }
    })
  })
}
