import { Headers } from 'request';
import $ from "jquery";
$("h1").eq(0).html("美亚订票查看");

declare let Vue: any;

let vm = new Vue({
    el: "#app",
    data: {
        agentsList: [],

        searchForm: false,
        searchResult: false,
        loading: false,
        domShow: {
            ordered: false,
            orderList: false,
            changeList: false,
            returnList: false
        },
        searchParam: {
            originCity: "",
            depatureCity: "",
            date: ""
        },
        choicedAgent: null,
        searchData: [],
        orderList: [],   //订单列表页数据
        changeList: [],   //改签单列表页
        returnList: [],    //退票单列表页

        //订票单操作
        orderOperation: {
            change(order) {
                alert("改签流程过于复杂，demo不提供");
            },
            return(order) {
                sendAjax({
                    url: "/order",
                    method: "post",
                    data: {
                        type: "return",
                        originalOrderNo: order.baseInfo.orderNo
                    },
                    async success(result) {
                        if (result.code == 0) {
                            alert("订单删除成功");
                            this.orderList = await orderList("order");
                        } else {
                            alert("订单删除失败，请重试: " + result.msg);
                            console.log("fail: ", result);
                        }
                    }
                });
            },
            delete(order) {
                sendAjax({
                    url: "/order/" + order.baseInfo.orderNo,
                    method: "delete",
                    data: {
                        type: "order"
                    },
                    async success(result) {
                        if (result.code == 0) {
                            alert("订单删除成功");
                            this.orderList = await orderList("order");
                        } else {
                            alert("订单删除失败，请重试: " + result.msg);
                            console.log("fail: ", result);
                        }
                    }
                });
            },
            confirm(order) {
                sendAjax({
                    url: "/order/" + order.baseInfo.orderNo,
                    method: "put",
                    data: {
                        type: "order"
                    },
                    async success(result) {
                        if (result.code == 0) {
                            alert("订单确定成功");
                            this.orderList = await orderList("order");
                        } else {
                            alert("订单确定失败，请重试: " + result.msg);
                            console.log("fail: ", result);
                        }
                    }
                });
            }
        },

        //改签单操作
        changeOperation: {
            delete(order) {
                sendAjax({
                    url: "/order/" + order.baseInfo.orderNo,
                    method: "delete",
                    data: {
                        type: "change"
                    },
                    async success(result) {
                        if (result.code == 0) {
                            alert("改签单删除成功");
                            this.changeList = await orderList("change");
                        } else {
                            alert("改签单删除失败，请重试: " + result.msg);
                            console.log("fail: ", result);
                        }
                    }
                });
            },
            confirm(order) {
                sendAjax({
                    url: "/order/" + order.baseInfo.orderNo,
                    method: "put",
                    data: {
                        type: "change"
                    },
                    async success(result) {
                        if (result.code == 0) {
                            alert("改签单确定成功");
                            this.changeList = await orderList("change");
                        } else {
                            alert("改签单确定失败，请重试: " + result.msg);
                            console.log("fail: ", result);
                        }
                    }
                });
            }
        },

        //退票单操作
        returnOperation: {
            delete(order) {
                sendAjax({
                    url: "/order/" + order.baseInfo.orderNo,
                    method: "delete",
                    data: {
                        type: "return"
                    },
                    async success(result) {
                        if (result.code == 0) {
                            alert("退票单删除成功");
                            this.returnList = await orderList("order");
                        } else {
                            alert("退票单删除失败，请重试: " + result.msg);
                            console.log("fail: ", result);
                        }
                    }
                });
            },
            confirm(order) {
                sendAjax({
                    url: "/order/" + order.baseInfo.orderNo,
                    method: "put",
                    data: {
                        type: "return"
                    },
                    async success(result) {
                        if (result.code == 0) {
                            alert("退票单确定成功");
                            this.returnList = await orderList("order");
                        } else {
                            alert("退票单确定失败，请重试: " + result.msg);
                            console.log("fail: ", result);
                        }
                    }
                });
            }
        }
    },

    methods: {
        async tapChange(index) {
            for (let key in this.domShow) {
                this.domShow[key] = false;
            }
            this.domShow[index] = true;

            switch (index) {
                case "ordered":
                    break;
                case "orderList":
                    this.orderList = await orderList("order");
                    break;
                case "changeList":
                    this.changeList = await orderList("change");
                    break;
                case "returnList":
                    this.returnList = await orderList("return");
                    break;
            }
        },
        choiceAgents(agent) {
            this.searchForm = true;
            this.choicedAgent = agent;
        },
        searchSubmit() {
            if (!this.searchParam.originCity) {
                alert("出发城市没有");
                return;
            }
            if (!this.searchParam.depatureCity) {
                alert("目的地城市没有");
                return;
            }
            if (!this.searchParam.date) {
                alert("出发时间没有");
                return;
            }

            let searchParam = {
                departureCode: "PEK",
                arrivalCode: "SHA",
                "depDate": this.searchParam.date,
                tripType: 1
            }
            searchTickets(searchParam, this.choicedAgent);
            this.searchResult = true;
        },
        orderTicket(flightInfo) {
            orderTicket(flightInfo);
        },

        //订单点击操作
        orderOperate(data) {

        }
    }
});


/* 查询机票 */
let searchTickets = (param, agented) => {
    sendAjax({
        url: "/searchflight",
        data: param,
        success(result) {
            console.log(1122, result);
            if (result.code != 0) {
                alert("机票查询失败");
                return;
            }
            vm.$data.searchData = result.data;
        }
    })
};

/* 预订机票 */
let orderTicket = async (ticket) => {
    let params = orderParam(ticket);
    sendAjax({
        url: "/order",
        method: "post",
        data: params,
        success(result) {
            if (result.code == 0) {
                alert("订票成功");
                console.log(result);
            } else {
                alert(result.msg);
            }
        }
    })
}

/* 订票参数 */
function orderParam(originData) {
    let params = {
        flightList: [],
        passengerList: [],
        contactList: null,
        type: "order"
    };

    let passenger = {
        name: "张栋",
        mobile: "15978561146",
        passengerType: "1",
        companyId: "S117325",
        certificatesList: [{
            certType: "身份证",
            certNumber: "411527199408012773"    //证件号码
        }]
    };

    let contacter = {
        name: "张栋",
        mobile: "15978561146"
    }

    params.passengerList.push(passenger);
    params.contactList = contacter;

    let priceInfos = originData["flightPriceInfoList"];


    let flightInfo = {
        flightID: priceInfos[0].flightID,           //航段序号 resultID+segmentID+priceID下划线分割
        departureCode: originData.departureCode,        //出发城市(三字码)
        arrivalCode: originData.arrivalCode,        //达到城市(三字码)
        depDate: originData.depDate,      //出发日期：yyyy-MM-dd
        airline: originData.airline,            //航空公司
        cabinType: priceInfos[0].cabinType,          //舱位等级, 通过供应商的查询信息获取，不要从 enum 中拿值
        flightNo: originData.flightNo,           //航班号（从航班查询返回获取）
        price: priceInfos[0].price,
    };

    params.flightList.push(flightInfo);

    return params;
}


/* 订票单，改签单，退票单列表 */
function orderList(types) {
    return new Promise((resolve, reject) => {
        sendAjax({
            url: "/order",
            data: {
                type: types
            },
            success(result) {
                console.log("orderlist =====> ", result);
                if (result.code == 0) {
                    resolve(result.data.result);
                } else {
                    alert(types + "列表获取失败" + result.msg);
                    resolve([]);
                }
            }
        })
    });
}



function sendAjax(params) {

    let info = {
        username: "JingLiZhiXiang",
        password: "123456"
    };

    let str = JSON.stringify(info);
    str = encodeURIComponent(str);
    // console.log("params===>", params);
    $.ajax({
        url: "http://192.168.1.57:4003" + params.url,
        headers: {
            auth: str,
            supplier: "meiya"
        },
        dataType: "json",
        data: params.data,
        method: params.method || 'get',
        success(result) {
            return params.success && params.success(result);
        },
        beforeSend() {
            vm.$data.loading = true;
        },
        complete() {
            vm.$data.loading = false;
        },
        error(e) {
            alert("数据请求出错");
            console.log(e);
            vm.$data.loading = false;
        }
    })
}