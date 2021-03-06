/*
    menu - img
*/
import $ from '../../util/dom-core.js'
import { getRandom, arrForEach } from '../../util/util.js'
import Panel from '../panel.js'

// 构造函数
function Image(editor) {
    this.editor = editor
    const imgMenuId = getRandom('w-e-img')
    this.$elem = $('<div class="w-e-menu" id="' + imgMenuId + '"><i class="w-e-icon-image"></i></div>')
    editor.imgMenuId = imgMenuId
    this.type = 'panel'

    // 当前是否 active 状态
    this._active = false
}

// 原型
Image.prototype = {
    constructor: Image,

    onClick: function () {
        const editor = this.editor
        const config = editor.config
        if (config.qiniu) {
            return
        }
        if (this._active) {
            this._createEditPanel()
        } else {
            this._createInsertPanel()
        }
    },

    _createEditPanel: function () {
        const editor = this.editor

        // id
        const max30 = getRandom('max-30')
        const max50 = getRandom('max-50')
        const max100 = getRandom('max-100')

        const width = getRandom('width')

        const height = getRandom('height')

        const delBtn = getRandom('del-btn')

        // tab 配置
        const tabsConfig = [
            {
                title: '编辑图片',
                tpl: `<div>
                    <div class="w-e-button-container" style="border-bottom:1px solid #f1f1f1;padding-bottom:5px;margin-bottom:5px;">
                        <div style="float:left;">
                            <span style="font-size:14px;margin:4px 5px 0 5px;color:#333;">宽度：</span>
                            <input id="${width}" class="left" style="width: 60px;border: 1px solid #eeeeee;height: 24px;"/>
                        </div>
                        <div style="float:right;">
                            <span style="font-size:14px;margin:4px 5px 0 5px;color:#333;">高度：</span>
                            <input id="${height}" class="left" style="width: 60px;border: 1px solid #eeeeee;height: 24px;"/>
                        </div>
                    </div>
                    <div class="w-e-button-container" style="border-bottom:1px solid #f1f1f1;padding-bottom:5px;margin-bottom:5px;">
                        <span style="float:left;font-size:14px;margin:4px 5px 0 5px;color:#333;">最大宽度：</span>
                        <button id="${max30}" class="left">30%</button>
                        <button id="${max30}" class="left">50%</button>
                        <button id="${max30}" class="left">100%</button>
                    </div>
                    <div class="w-e-button-container">
                        <button id="${delBtn}" class="gray left">删除图片</button>
                    </dv>
                </div>`,
                events: [
                    {
                        selector: '#' + max30,
                        type: 'click',
                        fn: () => {
                            const $img = editor._selectedImg
                            if ($img) {
                                $img.css('max-width', '30%')
                            }
                            // 返回 true，表示该事件执行完之后，panel 要关闭。否则 panel 不会关闭
                            return true
                        }
                    },
                    {
                        selector: '#' + max30,
                        type: 'click',
                        fn: () => {
                            const $img = editor._selectedImg
                            if ($img) {
                                $img.css('max-width', '50%')
                            }
                            // 返回 true，表示该事件执行完之后，panel 要关闭。否则 panel 不会关闭
                            return true
                        }
                    },
                    {
                        selector: '#' + max30,
                        type: 'click',
                        fn: () => {
                            const $img = editor._selectedImg
                            if ($img) {
                                $img.css('max-width', '100%')
                            }
                            // 返回 true，表示该事件执行完之后，panel 要关闭。否则 panel 不会关闭
                            return true
                        }
                    },
                    {
                        selector: '#' + width,
                        type: 'input propertychange',
                        fn: () => {
                            const widthNum = $('#' + width).val()
                            const $img = editor._selectedImg
                            if ($img) {
                                $img.css('width', widthNum+'px')
                            }
                            // 返回 true，表示该事件执行完之后，panel 要关闭。否则 panel 不会关闭
                            return false
                        }
                    },
                    {
                        selector: '#' + height,
                        type: 'input propertychange',
                        fn: () => {
                            const heightNum = $('#' + height).val()
                            const $img = editor._selectedImg
                            if ($img) {
                                $img.css('height', heightNum+'px')
                            }
                            // 返回 true，表示该事件执行完之后，panel 要关闭。否则 panel 不会关闭
                            return false
                        }
                    },
                    {
                        selector: '#' + delBtn,
                        type: 'click',
                        fn: () => {
                            const $img = editor._selectedImg
                            if ($img) {
                                $img.remove()
                            }
                            // 清空当前点击过的图片
                            editor._selectedImg = null

                            // 修改选区并 restore ，防止用户此时点击退格键，会删除其他内容
                            editor.selection.createEmptyRange()
                            editor.selection.collapseRange()
                            editor.selection.restoreSelection()

                            // 返回 true，表示该事件执行完之后，panel 要关闭。否则 panel 不会关闭
                            return true
                        }
                    }
                ]
            }
        ]

        // 创建 panel 并显示
        const panel = new Panel(this, {
            width: 300,
            tabs: tabsConfig
        })
        panel.show()

        // 记录属性
        this.panel = panel
    },

    _createInsertPanel: function () {
        const editor = this.editor
        const uploadImg = editor.uploadImg
        const config = editor.config

        // id
        const upTriggerId = getRandom('up-trigger')
        const upFileId = getRandom('up-file')
        const linkUrlId = getRandom('link-url')
        const linkBtnId = getRandom('link-btn')

        const upcheckId=getRandom('upcheckId')

        // tabs 的配置
        const tabsConfig = [
            {
                title: '上传图片',
                tpl: `<div class="w-e-up-img-container">
                        <div id="${upTriggerId}" class="w-e-up-btn">
                            <i class="w-e-icon-upload2"></i>
                        </div>
                        <div style="width: 100%;">
                            <div style="width: 10%;float: left;"><input type="checkbox" id="${upcheckId}"></div>
                            <div style="width: 90%;float: left;margin-bottom: 10px;text-align: left;font-size: 14px;">I certify this picture is of me, by me, or that I have explicit permission to post it on Lovense.</div>
                        </div>
                        <div style="display:none;">
                            <input id="${upFileId}" type="file" multiple="multiple" accept="image/jpg,image/jpeg,image/png,image/gif,image/bmp"/>
                        </div>
                </div>`,
                events: [
                    {
                        // 触发选择图片
                        selector: '#' + upcheckId,
                        type: 'click',
                        fn: () => {
                            if($('#' + upTriggerId).hasClass('active')){
                                $('#' + upTriggerId).removeClass('active')
                            }else{
                                $('#' + upTriggerId).addClass('active')
                            }
                            return false
                        }
                    },
                    {
                        // 触发选择图片
                        selector: '#' + upTriggerId,
                        type: 'click',
                        fn: () => {
                            if(!$('#' + upTriggerId).hasClass('active')){
                                return false
                            }
                            const $file = $('#' + upFileId)
                            const fileElem = $file[0]
                            if (fileElem) {
                                fileElem.click()
                            } else {
                                // 返回 true 可关闭 panel
                                return true
                            }
                        }
                    },
                    {
                        // 选择图片完毕
                        selector: '#' + upFileId,
                        type: 'change',
                        fn: () => {
                            const $file = $('#' + upFileId)
                            const fileElem = $file[0]
                            if (!fileElem) {
                                // 返回 true 可关闭 panel
                                return true
                            }

                            // 获取选中的 file 对象列表
                            const fileList = fileElem.files
                            if (fileList.length) {
                                uploadImg.uploadImg(fileList)
                            }

                            // 返回 true 可关闭 panel
                            return true
                        }
                    }
                ]
            }, // first tab end
            {
                title: '网络图片',
                tpl: `<div>
                    <input id="${linkUrlId}" type="text" class="block" placeholder="图片链接"/></td>
                    <div class="w-e-button-container">
                        <button id="${linkBtnId}" class="right">插入</button>
                    </div>
                </div>`,
                events: [
                    {
                        selector: '#' + linkBtnId,
                        type: 'click',
                        fn: () => {
                            const $linkUrl = $('#' + linkUrlId)
                            const url = $linkUrl.val().trim()

                            if (url) {
                                uploadImg.insertLinkImg(url)
                            }

                            // 返回 true 表示函数执行结束之后关闭 panel
                            return true
                        }
                    }
                ]
            } // second tab end
        ] // tabs end

        // 判断 tabs 的显示
        const tabsConfigResult = []
        if ((config.uploadImgShowBase64 || config.uploadImgServer || config.customUploadImg) && window.FileReader) {
            // 显示“上传图片”
            tabsConfigResult.push(tabsConfig[0])
        }
        if (config.showLinkImg) {
            // 显示“网络图片”
            tabsConfigResult.push(tabsConfig[1])
        }

        // 创建 panel 并显示
        const panel = new Panel(this, {
            width: 300,
            tabs: tabsConfigResult
        })
        panel.show()

        // 记录属性
        this.panel = panel
    },

    // 试图改变 active 状态
    tryChangeActive: function (e) {
        const editor = this.editor
        const $elem = this.$elem
        if (editor._selectedImg) {
            this._active = true
            $elem.addClass('w-e-active')
            this._createEditPanel()
        } else {
            this._active = false
            $elem.removeClass('w-e-active')
        }
    }
}

export default Image