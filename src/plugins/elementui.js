import Vue from 'vue'
import { Button ,Container,Header,Aside,Main,Footer,Icon
,Carousel,CarouselItem,
Tabs,TabPane,Input,Pagination,Loading,Dialog,MessageBox,Message,Tooltip,Slider} from 'element-ui'

Vue.use(Loading.directive)
Vue.prototype.$loading = Loading.service

Vue.prototype.$msgbox = MessageBox;
Vue.prototype.$alert = MessageBox.alert;
Vue.prototype.$confirm = MessageBox.confirm;
Vue.prototype.$prompt = MessageBox.prompt;
Vue.prototype.$message = Message;

Vue.use(Button)
Vue.use(Container)
Vue.use(Header)
Vue.use(Aside)
Vue.use(Main)
Vue.use(Footer)
Vue.use(Icon)
Vue.use(Carousel)
Vue.use(CarouselItem)
Vue.use(Tabs)
Vue.use(TabPane)
Vue.use(Input)
Vue.use(Pagination)
Vue.use(Dialog)
Vue.use(Tooltip)
Vue.use(Slider)
