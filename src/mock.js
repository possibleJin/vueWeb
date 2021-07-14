
//自动生成数据
const Mock = require('mockjs')
const Random = Mock.Random
// 新闻数据包括title content
const produceNewData = function(){
    let newsList = []
    for (let i = 0 ; i < 20 ; i++){
        let newsObject = {
            title: Random.ctitle(),
            content: Random.cparagraph(),
            createdTime: Random.date()
        }
        newsList.push(newsObject)
    }
    return newsList
}

Mock.mock('/mock/news',produceNewData)


