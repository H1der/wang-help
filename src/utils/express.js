const expressList = [
  {
    "name": "中通快递",
    "code": "zto"
  },
  {
    "name": "申通快递",
    "code": "sto"
  },
  {
    "name": "圆通速递",
    "code": "yto"
  },
  {
    "name": "天天快递",
    "code": "tiantian"
  },
  {
    "name": "EMS快递",
    "code": "ems"
  },
  {
    "name": "韵达快递",
    "code": "yunda"
  },
  {
    "name": "优速快递",
    "code": "yousu"
  },
  {
    "name": "百世快运",
    "code": "800best"
  },
  {
    "name": "百世汇通快递",
    "code": "huitong"
  },
  {
    "name": "宅急送快递",
    "code": "zhaijisong"
  },
  {
    "name": "龙邦快递",
    "code": "longbang"
  },
  {
    "name": "苏宁快递",
    "code": "suning"
  },
  {
    "name": "国通快递",
    "code": "guotong"
  },
  {
    "name": "京东快递",
    "code": "jingdong"
  },
  {
    "name": "邮政",
    "code": "pingyou"
  },
  {
    "name": "邮政",
    "code": "postb"
  },
  {
    "name": "顺丰",
    "code": "shunfeng"
  }
]
export default function findExpressCompanyByCode(code) {
  return expressList.find((item) => {
    return item.code === code
  })
};
