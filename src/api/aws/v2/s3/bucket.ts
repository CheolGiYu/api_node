const {S3Key} = require('../../key');
const AWS = require('aws-sdk');
AWS.config.update({region: S3Key.region});

const S3 = new AWS.S3(S3Key);
const IAM = new AWS.IAM(S3Key);

const bucketList = async () => {
	return await S3
  	.listBuckets() // s3 버킷 정보 가져오기
  	.promise() // 메소드를 프로미스 객체화
  	.then((data: any) => {
  	   	return 'S3 : '+ JSON.stringify(data, null, 2);
  	}).catch((error: any) => {
  		return "error : " + JSON.stringify(error, null, 2);
  	});
};
const bucketCreate = async (name: string) => {
	return await S3
  	.createBucket({ Bucket: name })
  	.promise()
  	.then((bucket: any) => {
  		return "bucket : " + JSON.stringify(bucket, null, 2);
  	})
  	.catch((error: any) => {
  	   	return "error : " + JSON.stringify(error, null, 2);
  	});
};

const bucketAcl = async (bucket: string, BlockPublicAcls: boolean, BlockPublicPolicy: boolean, IgnorePublicAcls: boolean, RestrictPublicBuckets: boolean) => {
	return await S3
	.putPublicAccessBlock({
		Bucket: bucket,
		PublicAccessBlockConfiguration: {
			BlockPublicAcls: BlockPublicAcls,
			BlockPublicPolicy: BlockPublicPolicy,
			IgnorePublicAcls: IgnorePublicAcls,
			RestrictPublicBuckets: RestrictPublicBuckets,
		}
	})
	.promise()
	.then((bucket: any) => {
  		return "bucket : " + JSON.stringify(bucket, null, 2);
  	})
  	.catch((error: any) => {
  	   	return "error : " + JSON.stringify(error, null, 2);
  	});
};

const bucketCors = async (bucket: string, origin: string) => {
	const corsConfig = {
	  "CORSRules": [
	    {
	      "AllowedOrigins": [`${origin}`],
	      "AllowedMethods": ["GET", 'POST', 'PUT', 'DELETE'],
	      "AllowedHeaders": ["Content-Type", "Authorization"],
	      "MaxAgeSeconds": 300,
	    }
	  ]
	}

	return await S3
	.putBucketCors({
	 	Bucket: bucket,
	 	CORSConfiguration: corsConfig,
	})
	.promise()
	.then((bucket: any) => {
  		return "bucket : " + JSON.stringify(bucket, null, 2);
  	})
  	.catch((error: any) => {
  	   	return "error : " + JSON.stringify(error, null, 2);
  	});
};

const bucketPolicy = async (bucket: string, origin: string) => {
	IAM.getUser({
	  UserName: 's3-api',
	}).promise().then((response: any) => {
	  	const policyConfig = {
			"Version": "2012-10-17",
			"Statement": [
			  {
			  	"Sid": "AllowAll",
			  	"Principal": {
	    	  	  	"AWS": [
	    	  	  	    `${response.User.Arn}`
	    	  	  	]
	    	  	},
			  	"Effect": "Allow",
			  	"Action": [
			  		"s3:*"
			  	],
			  	"Resource": [
			  		`arn:aws:s3:::${bucket}/*`,
			  		`arn:aws:s3:::${bucket}`
			  	],
			  }
			]
		};

		return S3
		.putBucketPolicy({
		  Bucket: bucket,
		  Policy: JSON.stringify(policyConfig),
		})
		.promise()
		.then((bucket: any) => {
			console.log('1');
  			return "bucket : " + JSON.stringify(bucket, null, 2);
  		})
  		.catch((error: any) => {
  		   	return "error : " + JSON.stringify(error, null, 2);
  		});
	}).catch((error: any) => {
	  console.log(error);
	});
};

const bucketFileList = async (bucket: string) => {//메소드 추가 해야함(리스트 게시판)
	return await S3
  	.listObjectsV2({ Bucket: bucket })
  	.promise()
  	.then((data: any) => {
  	   return "bucket : " + JSON.stringify(data, null, 2);
  	})
  	.catch((error: any) => {
  	   return "error : " + JSON.stringify(error, null, 2);
  	});
};

const fileBuffer = async (bucket: string, key: Array<string>) => {
	return await S3
	.getObject({
	  Bucket: bucket,
	  Key: key
	})
	.promise()
  	.then((data: any) => {
  	   	return data;
  	})
  	.catch((error: any) => {
  	   return "error : " + JSON.stringify(error, null, 2);
  	});
};


module.exports = {
	bucketList: bucketList,
	bucketCreate: bucketCreate,
	bucketAcl: bucketAcl,
	bucketCors: bucketCors,
	bucketPolicy: bucketPolicy,
	bucketFileList: bucketFileList,
	fileBuffer: fileBuffer,
}