const menu = [{
    path: '/index',
    key: 'index',
    name: '主页',
}, {
    path: '/plan',
    key: 'plan',
    name: '资金方案'
}, {
    path: '/topup',
    key: 'topup',
    name: '充值'
}, {
    path: '/withdrawal',
    key: 'withdrawal',
    name: '提现'
}, {
    path: '/moneyWater',
    key: 'moneyWater',
    name: '资金流水',
    filter: [],
    needTime: { key: 'create_time', value: 'RANGE' }
}, {
    path: '/mIndex',
    key: 'mIndex',
    name: '首页',
}, {
    path: '/deposit/:id',
    key: 'deposit',
    name: '策略',
}];
export const MENU = menu;
