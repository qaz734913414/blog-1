---
layout: column_1_2
title:  "RESTful API 设计规范"
description: "RESTful API 设计规范"
keywords: 架构实践
origin: 张嘉杰.原创
date:   2017-10-20
category: architect
tags: architect restful-api
---

互联网公司 RESTful API 接口设计规范。
<!--more-->

![architect]({{ "/resources/images" | prepend: site.staticurl }}{{ page.url }}.png)

## API接口规范
- - - - -

> 设计规范

	* 整体规范采用`RESTful`模式
	* 请求和返回数据类型统一为`JSON`
	* 所有拆分`API`服务接口，必须提供请求参数、响应结果、业务错误码
	* 所有请求、响应参数变量均使用小写  

> 接口协议

	`API`与应用服务的通信协议采用`HTTP`协议。
	**支付、订单** 等重要服务通信协议建议采用`HTTPs`协议，确保交互数据的传输安全。

> HTTP 请求方式

常用的`HTTP`动词有下面四个（对应的`SQL`命令）


| 请求方式    | SQL命令   | 描述 |
| ------    | ------   | --- |
| GET           | SELECT    | 获取资源（一项或多项） |
| POST         | CREATE   | 新建资源 |
| PUT           | UPDATE  | 更新资源 |
| DELETE     | DELETE   | 删除资源 |


下面是一个用户相关的例子

| 请求方式    | URL                       | 描述 |
| ------    | ---                       | --- |
|GET            | /users                     | 获取所有用户 |
|POST          | /users                     | 创建一个用户 |
|GET            | /users/ID                | 获取某个指定用户的信息 |
|PUT            | /users/ID                | 更新某个指定用户的信息 |
|DELETE      | /users/ID               | 删除某个用户 |
|GET            | /users/ID/gifts       | 获取某个指定用户的所有礼券 |
|GET            | /users/ID/gifts/ID | 获取某个指定用户的指定礼券信息 |


> URI 规范

	* 避免层级过深的`URI`
	* 不用大写
	* 用中杠`-`而不用下杠`_`
	* 参数列表要`encode`
	* `URI`中的名词表示资源集合，使用复数形式

> 安全性、幂等性

	* 安全性：不会改变资源状态，可以理解为只读的
	* 幂等性：执行1次和执行N次，对资源状态改变的效果是等价的


| 请求类型   |安全性	|幂等性 |
| ------   |----	|----- |
| GET	       | √           | √ |
| POST	       | ×           | × |
| PUT	       | ×           | √ |
| DELETE	  | ×           | √ |


安全性和幂等性均不保证反复请求能拿到相同的`response`。以`DELETE`为例，第一次`DELETE`返回200表示删除成功，第二次返回404提示资源不存在，这是允许的。

> 复杂查询

下面是一些常见的参数


|条件           |URL参数                             | 描述 |
|---           |------                             | --- |
|过滤条件   | ?type=1&age>30              | 指定返回条件的记录数 |
|分页           | ?limit=10&offset=3          | 指定第几页，以及每页的记录数 |
|排序           | ?sort=id,desc                     | 指定返回结果按照哪个属性排序，以及排序顺序 |
|集合           | ?list=id,name                     | 指定集合字段记录数 |


> HTTP 状态码

服务器向用户返回的状态码和提示信息，常见的有以下一些。

| 状态码 | 请求方式 | 提示信息 | 描述 |
| ----- | ------ | ------ | --- |
| 200 | GET | OK | 服务器成功返回用户请求的数据，该操作是幂等的（Idempotent）|
| 201 | POST/PUT/PATCH | CREATED | 用户新建或修改数据成功 |
| 202 |  *  | Accepted | 表示一个请求已经进入后台排队（异步任务）|
| 204 | DELETE | NO CONTENT | 用户删除数据成功 |
| 400 | POST/PUT/PATCH | INVALID REQUEST | 用户发出的请求有错误，服务器没有进行新建或修改数据的操作，该操作是幂等的 |
| 401 |  *  | Unauthorized | 表示用户没有权限（令牌、用户名、密码错误）|
| 403 |  *  | Forbidden | 表示用户得到授权（与401错误相对），但是访问是被禁止的 |
| 404 |  *  | NOT FOUND | 用户发出的请求针对的是不存在的记录，服务器没有进行操作，该操作是幂等的 |
| 406 | GET | Not Acceptable | 用户请求的格式不可得（比如用户请求JSON格式，但是只有XML格式）|
| 410 | GET | Gone | 用户请求的资源被永久删除，且不会再得到的 |
| 422 | POST/PUT/PATCH | Unprocesable entity | 当创建一个对象时，发生一个验证错误 |
| 500 |  *  | INTERNAL SERVER ERROR | 服务器发生错误，用户将无法判断发出的请求是否成功 |


> 传入参数

	* 地址栏参数
	    1. `restful`地址栏参数`/api/users/1`（1为用户编号，获取用户为1的用户信息）
	    2. `get`方式的查询字串 见过滤信息小节
	* 请求`body`数据
	    1. `cookie`
	    2. `request header`（`cookie`和`header`一般都用于`OAuth`认证 ）

> 返回结果

为了保障前后端的数据交互的顺畅，规范数据的返回，采用固定的数据格式封装。


| 参数         | 类型   | 描述 |
| ---         | ---   | --- |
| code         | String | 网关返回码 |
| msg          | String | 网关返回码描述 |
| sub_code | String | 业务返回码 |
| sub_msg  | String | 业务返回码描述 |
| result	      | String | 返回结果 |


参数具体说明


<table>
  <tr>
    <th>code</th>
    <th>msg</th>
    <th>sub_code</th>
    <th>sub_msg</th>
  </tr>
  <tr>
    <td>10000</td>
    <td>接口调用成功</td>
    <td></td>
    <td></td>
  </tr>
  <tr>
    <td rowspan="2">20000</td>
    <td rowspan="2">服务不可用</td>
    <td>business.unknow-error</td>
    <td>服务暂不可用（业务系统不可用）</td>
  </tr>
  <tr>
    <td>server.unknow-error</td>
    <td>服务暂不可用（网关自身的未知错误）</td>
  </tr>
  <tr>
    <td rowspan="5">20001</td>
    <td rowspan="5">授权权限不足</td>
    <td>server.invalid-auth-token</td>
    <td>无效的访问令牌</td>
  </tr>
  <tr>
    <td>server.auth-token-time-out</td>
    <td>访问令牌已过期</td>
  </tr>
  <tr>
    <td>server.invalid-app-auth-token</td>
    <td>无效的应用授权令牌</td>
  </tr>
  <tr>
    <td>server.invalid-app-auth-token-no-api</td>
    <td>未授权当前接口</td>
  </tr>
  <tr>
    <td>server.app-auth-token-time-out</td>
    <td>应用授权令牌已过期</td>
  </tr>
  <tr>
    <td rowspan="5">40001</td>
    <td rowspan="5">缺少必选参数</td>
    <td>xxx.missing-method</td>
    <td>缺少方法名参数</td>
  </tr>
  <tr>
    <td>xxx.missing-signature</td>
    <td>缺少签名参数</td>
  </tr>
  <tr>
    <td>xxx.missing-app-id</td>
    <td>缺少appId参数</td>
  </tr>
  <tr>
    <td>xxx.missing-timestamp</td>
    <td>缺少时间戳参数</td>
  </tr>
  <tr>
    <td>xxx.missing-version</td>
    <td>缺少版本参数</td>
  </tr>
  <tr>
    <td rowspan="15">40002</td>
    <td rowspan="15">非法的参数</td>
    <td>xxx.invalid-parameter</td>
    <td>参数无效（检查参数，格式不对、非法值、越界等）</td>
  </tr>
  <tr>
    <td>xxx.upload-fail</td>
    <td>文件上传失败</td>
  </tr>
  <tr>
    <td>xxx.invalid-file-extension</td>
    <td>文件扩展名无效</td>
  </tr>
  <tr>
    <td>xxx.invalid-file-size</td>
    <td>文件大小无效</td>
  </tr>
  <tr>
    <td>xxx.invalid-method</td>
    <td>不存在的方法名</td>
  </tr>
  <tr>
    <td>xxx.invalid-format</td>
    <td>无效的数据格式</td>
  </tr>
  <tr>
    <td>xxx.invalid-signature-type</td>
    <td>无效的签名类型</td>
  </tr>
  <tr>
    <td>xxx.invalid-signature</td>
    <td>无效签名</td>
  </tr>
  <tr>
    <td>xxx.invalid-encrypt-type</td>
    <td>无效的加密类型</td>
  </tr>
  <tr>
    <td>xxx.invalid-encrypt</td>
    <td>解密异常</td>
  </tr>
  <tr>
    <td>xxx.invalid-app-id</td>
    <td>无效的appId参数</td>
  </tr>
  <tr>
    <td>xxx.invalid-timestamp</td>
    <td>非法的时间戳参数</td>
  </tr>
  <tr>
    <td>xxx.invalid-charset</td>
    <td>字符集错误</td>
  </tr>
  <tr>
    <td>xxx.missing-signature</td>
    <td>验签出错</td>
  </tr>
  <tr>
    <td>xxx.not-support-app-auth</td>
    <td>本接口不支持第三方代理调用</td>
  </tr>
  <tr>
    <td>40004</td>
    <td>业务处理失败</td>
    <td colspan="2">对应业务错误码</td>
  </tr>
  <tr>
    <td rowspan="2">40006</td>
    <td rowspan="2">权限不足</td>
    <td>xxx.insufficient-operate-permissions</td>
    <td>操作权限不足</td>
  </tr>
  <tr>
    <td>xxx.insufficient-user-permissions</td>
    <td>用户权限不足</td>
  </tr>
</table>



接口返回模板：
```json
// 成功
{
    "code": 10000,
    "msg": "操作成功！",
    "sub_code": null,
    "sub_msg": null,
    "result": [
        {"id": 1, "username": "张三", "member": 1},
        {"id": 2, "username": "李四", "member": 0}
     ]
}

// 失败
{
    "code": 40004,
    "msg": "业务处理失败！",
    "sub_code": "xxx.SYSTEM_ERROR",
    "sub_msg": "系统内部异常！",
    "result": null
}
```

> 速率限制

请求速率限制，根据`app_key`，`sign_key`来判断用户某段时间的请求次数，将该数据更新到内存数据库`redis`、`memcached`，达到最大数即不接受该用户的请求，同时这样还可以利用到内存数据库`key`在特定时间自动过期的特性。在返回时设置`X-Rate-Limit-Reset`，当前时间段剩余秒数。

参考：`Github`的`API`的设计，它会在返回的`HTTP`头信息里带上：

	* `X-RateLimit-Limit: 5000`
	* `X-RateLimit-Remaining: 4999`

表示这个接口在某一时间段内，该授权用户调用该接口的最大次数为`5000`次，该时间段内还剩余`4999`次。  

> 接口签名

	* 权限分配
	    1. 对于每个类型客户端服务端会分配`apiKey`和`apiSecret`做安全签名使用
	* 请求`Header`
	    1. Accept: application/json
	    2. X-Api-Key: jGw7SRN6qckRc0jz （请求apiKey，由后端分发）
	    3. X-Signature: 8STR59mJWFKv11GhdzSwd9iBzsySRKjt （根据签名算法算出的签名）
	    4. X-Access-Token: 5262d64b892e8d4341000001 （用户登录后的AccessToken）
	    5. X-App-Version: 1.0 （接口版本）
	    6. X-Timestamp: 1508839280 （时间戳，为时间转换为的毫秒）
	    7. X-Nonce: MBESwVRPSBgf48npjfuMPFzCGwMjLIac （32位随机字符串，防重复）
	* 签名算法
	    1. 参与签名计算的字符串
	    2. sign = `HTTPMethod`+`Path`+`Args`+`json_body_base64`+`Timestamp`+`Nonce`
	    	2.1 `HTTPMethod`为请求方法的大写，如`GET、POST`
	     	2.2 `Path`为请求接口地址`path` ，如请求地址为`http://www.ylkj.com/api/users`的`path`为`/api/users`
	     	2.3 `Args`为将所有请求参数，（包括`query`和`body`中的参数）以`key=value`组合，然后按字母顺序排列后使用`&`符号连接在一起，当提交类型为`Form`时，`file`类型参数不参与签名
	     	2.4 `json_body_base64`如果请求`body`为`json`时此值为`body`内容使用`base64`编码后的值，`body`非`json`时此值为空
	     	2.5 `Timestamp`和`Nonce`分别与头部中`X-Timestamp`和`X-Nonce`值相同
	     	2.6 所有参数和`json_body`在计算时需要移除首尾空白字符，包括空格和回车等，但在请求时可以包含首尾空白符仅不参与签名
	* 使用分配的`apiSecret`和`hmac-sha256`算法生成签名
	    1. 先使用`hmac-sha256`对第一步得到的`sign`做`hash`运算并将得到的值使用`base64`编码
	* 生成的签名字符串以`X-Signature`为`key`放入请求头部
	

生成签名部分代码  

```java
import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import org.apache.commons.codec.binary.Base64;

public class GenerateSignature {
	public static void main(String[] args) {
		try {
			String apiSecret = "secret";
			String stringToSign = "sign";

			Mac sha256_HMAC = Mac.getInstance("HmacSHA256");
			SecretKeySpec secret_key = new SecretKeySpec(apiSecret.getBytes(), "HmacSHA256");
			sha256_HMAC.init(secret_key);

			String hash = Base64.encodeBase64String(sha256_HMAC.doFinal(stringToSign.getBytes()));
			System.out.println(hash);
		} catch (Exception e){
			System.out.println("Error");
		}
	}
}
```

- - - - -
> 如果你喜欢本文，请分享到朋友圈。  
> 想要获得更多信息，请关注我。

![](http://ox564wtna.bkt.clouddn.com/architect/_image/qrcode_for_gh_1a76c2ff77c7_430.jpg)


