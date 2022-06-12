import * as AWS from 'aws-sdk'
import { config } from './database.config'

const c = config.dev

const credentials = new AWS.SharedIniFileCredentials({
    profile: c.aws_profile,
})
AWS.config.credentials = credentials

const s3 = new AWS.S3({
    signatureVersion: 'v4',
    region: c.aws_region,
    params: { Bucket: c.aws_media_bucket },
})

const signedURLExpireSeconds = 60 * 5

/* getGetSignedUrl generates an aws signed url to retreive an item
 * @Params
 *    key: string - the filename to be put into the s3 bucket
 * @Returns:
 *    a url as a string
 */
function getSigedURL(key: string): string {
    const url = s3.getSignedUrl('getObject', {
        Bucket: c.aws_media_bucket,
        Key: key,
        Expires: signedURLExpireSeconds,
    })

    return url
}

/* getPutSignedUrl generates an aws signed url to put an item
 * @Params
 *    key: string - the filename to be retreived from s3 bucket
 * @Returns:
 *    a url as a string
 */
function getPutSignedURL(key: string) {
    const url = s3.getSignedUrl('putObject', {
        Bucket: c.aws_media_bucket,
        Key: key,
        Expires: signedURLExpireSeconds,
    })

    return url
}
