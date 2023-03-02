import Mock from "mockjs"

// 获取 mock.Random 对象

const Random = Mock.Random;

// 正式接口还没有出来之前  给一些假的接口   模拟ajax请求 
Mock.mock("/mock/demo","get",function(){
    return {
        type:1,
        code:200,
        msg:"前端获取mockjs 成功",
        result:{
            username:"wh2010"
        }
    }
})


Mock.mock("/mock/login","post",function(req,res){
    console.log(req)
    console.log(res)
    return {
        type:1,
        code:200,
        msg:"登录成功",
        result:{
            username:"wh2010",
            password:"abc123"
        }
    }
})

Mock.mock("/mock/longdata","get",function(req,res){
    const result = []
    for(var i = 0;i<250;i++){
        let obj =  {
            uid:Random.id(), 
            title:Random.csentence(5,28),  // 随机的标题 
            city:Random.city(),  // 随机的城市
            names:Random.cname(), // 名字 
            pic:Random.image('200x100', '#02adea', 'wuhan2010'),
            time:Random.date('yyyy-MM-dd') + " " + Random.time()
        }
        result.push(obj)
    }
    return {
        type:1,
        code:200,
        msg:"获取数据成功",
        result
    }
})
