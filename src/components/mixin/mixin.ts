import { App } from 'vue'
import MixinForm from './mixin-form.vue'
import MixinTable from './mixin-table.vue'
import MixinModal from './mixin-modal.vue'
import MixinImport from '_c/mixin/mixin-import.vue'
import CustomModal from '@/views/demo/modal/demoModal.vue'

export default {
  install(app: App) {
    app.component('MixinForm', MixinForm)
    app.component('MixinTable', MixinTable)
    app.component('MixinModal', MixinModal)
    app.component('MixinImport', MixinImport)
    app.component('CustomModal', CustomModal)
  }
}