import React from 'react';
import ReactDOM from 'react-dom/client';
import { Tabs, Alert, Radio, Button, message, Spin, Modal, Input } from 'antd';
import axios from 'axios';
import {
  YoutubeOutlined,
  WindowsOutlined,
  ContainerOutlined,
  PictureOutlined,
  FileSearchOutlined,
  ExclamationCircleOutlined,
  SettingOutlined,
  DownloadOutlined,
  SyncOutlined,
} from '@ant-design/icons';
import ImgItemList from './component/imgItemList';
import VideoItemList from './component/videoItemList';
import TxItemList from './component/txItemList';

import './index.scss';

const { TextArea } = Input;

type PropType = {
  taobaoDetail: any;
};

type StateType = {
  fileNamePath: string;
  activeKey: string;
  tabsItems: any;
  loadType: number;
  total: number;
  currentAmount: number;
  loading: boolean;
  itemId: string;
  onePrice: string;
  spinning: boolean;
  isModalOpen: boolean;
  access_token: string;
  fixUrl: string;
};
class PupupPage extends React.Component<PropType, StateType> {
  constructor(props: PropType | Readonly<PropType>) {
    super(props);
    this.state = {
      fixUrl: 'http://127.0.0.1:7001/api/product/createProductPushData',
      access_token:
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImhvdV92ZUBob3RtYWlsLmNvbSIsImlhdCI6MTczNjc4MjQwMn0.ABRPoHVk4kYkCJ01ODnjBqQtl1DpBYyvNQr2PXkhxs4',
      isModalOpen: false,
      spinning: false,
      fileNamePath: '',
      total: 0,
      currentAmount: 0,
      activeKey: 'additional_image_link',
      tabsItems: [
        {
          label: (
            <span>
              <WindowsOutlined />
              主图
            </span>
          ),
          key: 'additional_image_link',
          currentAmount: 0,
          data: [],
        },
        {
          label: (
            <span>
              <WindowsOutlined />
              白底图
            </span>
          ),
          key: 'image_link',
          currentAmount: 0,
          data: [],
        },
        {
          label: (
            <span>
              <PictureOutlined />
              详情
            </span>
          ),
          key: 'lifestyle_image_link',
          currentAmount: 0,
          data: [],
        },
        {
          label: (
            <span>
              <PictureOutlined />
              SKU
            </span>
          ),
          key: 'sku',
          currentAmount: 0,
          data: [],
        },
        {
          label: (
            <span>
              <YoutubeOutlined />
              视频
            </span>
          ),
          key: 'video',
          currentAmount: 0,
          data: [],
        },
        {
          label: (
            <span>
              <ContainerOutlined />
              文本
            </span>
          ),
          key: 'attr',
          currentAmount: 0,
          data: [],
        },
      ],
      itemId: '',
      onePrice: '',
      loadType: 1,
      loading: false,
    };
  }
  // 点击tab切换
  tabsChange = (activeKey: any) => {
    console.log('activeKey:', activeKey);
    const { tabsItems } = this.state;
    const tabsObj = {};
    tabsItems.map((item: { key: string }) => {
      // @ts-ignore
      tabsObj[item.key] = item;
    });
    // @ts-ignore
    let currentAmount = tabsObj[activeKey].currentAmount;
    this.setState({
      activeKey,
      currentAmount,
    });
  };
  // 选择
  radioChange = (value: any) => {
    this.setState({
      loadType: value.target.value,
    });
  };
  // 现在按钮事件
  downloadEvent = () => {
    const { loadType, activeKey, tabsItems, fileNamePath } = this.state;
    const urlPath: {}[] = [];
    const tabsItemsObj = {};
    // @ts-ignore
    tabsItems.map((item) => {
      // @ts-ignore
      tabsItemsObj[item.key] = item;
    });
    // @ts-ignore
    if (loadType === 1) {
      // @ts-ignore
      // eslint-disable-next-line array-callback-return
      tabsItems.map((list) => {
        if (list.key) {
          list.data &&
            list.data.length &&
            // eslint-disable-next-line array-callback-return
            list.data.map((item: { src: any; path: string; title: string }) => {
              const obj = {};
              // @ts-ignore
              obj['src'] = item.imgSrc;
              // @ts-ignore
              obj['filename'] = item.filename;
              // @ts-ignore
              obj['filenamePath'] = fileNamePath + '/' + item.from + '/' + item.filename;
              urlPath.push(obj);
            });
        }
      });
    } else {
      if (activeKey) {
        // @ts-ignore
        const tabsData = tabsItemsObj[activeKey] && tabsItemsObj[activeKey].data;
        // eslint-disable-next-line array-callback-return
        tabsData.map((item: { src: any; path: string; title: string }) => {
          const obj = {};
          // @ts-ignore
          obj['src'] = item.imgSrc;
          // @ts-ignore
          obj['filename'] = item.filename;
          // @ts-ignore
          obj['filenamePath'] = fileNamePath + '/' + item.from + '/' + item.filename;
          urlPath.push(obj);
        });
      }
    }
    console.log('urlPath:', urlPath);
    if (urlPath && urlPath.length) {
      if (chrome && chrome.downloads) {
        // eslint-disable-next-line array-callback-return
        urlPath.map((item) => {
          console.log('chrome.downloads:', item);
          chrome.downloads.download(
            {
              // @ts-ignore
              url: item.src,
              // @ts-ignore
              filename: item.filenamePath,
              saveAs: false,
              conflictAction: 'overwrite',
            },
            function (downloadId: number) {
              console.log(downloadId);
            }
          );
        });
      }
      this.setState(
        {
          loading: true,
        },
        () => {
          setTimeout(() => {
            this.setState({
              loading: false,
            });
          }, 5000);
        }
      );
    } else {
      console.log('不存在下载资源');
    }
  };
  // 列表下载
  itemDownloadEvent = (item: any) => {
    console.log('item:', item);
    if (item && item.imgSrc && chrome && chrome.downloads) {
      chrome.downloads.download(
        {
          // @ts-ignore
          url: item.imgSrc,
          // @ts-ignore
          filename: item.filenamePath,
          saveAs: false,
        },
        function (downloadId: number) {
          console.log(downloadId);
        }
      );
    }
  };
  // 打开新窗口
  openTargeWindow = (item: { imgSrc: string }) => {
    window.open(item.imgSrc, '_blank');
  };
  pushDownloadCookies = () => {
    this.setState({
      isModalOpen: true,
    });
  };
  pushDataEvent = () => {
    const { tabsItems, fileNamePath, itemId, onePrice, access_token, fixUrl } = this.state;
    if (access_token && tabsItems && fileNamePath) {
      const postData = {
        access_token,
        type: 'push-data',
        data: tabsItems,
        title: fileNamePath,
        itemId,
        onePrice,
      };
      console.log('messageData:', postData);
      // const resourceUrl = 'http://127.0.0.1:7001/api/product/createProductPushData';
      // const resourceUrl = 'https://api.limeetpet.com/api/product/createProductPushData';
      this.setState({
        spinning: true,
      });
      axios
        .post(fixUrl, postData, {
          withCredentials: true,
          timeout: 50000,
        })
        .then((res) => {
          console.log('res:', res);
          if (res && res.data && res.data.status === 200) {
            this.setState({
              spinning: false,
            });
            message.success({ content: '发送成功', duration: 10 });
          } else {
            this.setState({
              spinning: false,
            });
            message.error({ content: res.data.msg, duration: 10 });
          }
        })
        .catch((error) => {
          this.setState({
            spinning: false,
          });
          message.error({ content: error, duration: 10 });
        });
    } else {
      this.setState({
        spinning: false,
      });
      message.error({ content: '缺少参数' });
    }
  };
  // 刷新数据
  refreshContent = () => {
    const _self = this;
    const { tabsItems, activeKey } = this.state;
    chrome.storage.local.get(['access_token'], (result) => {
      this.setState({
        access_token: result.access_token,
      });
    });
    chrome.storage.local.get(['fixUrl'], (result) => {
      this.setState({
        fixUrl: result.fixUrl,
      });
    });
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs: any) {
      tabs &&
        tabs.length > 0 &&
        chrome.tabs.sendMessage(tabs[0].id, { type: 'popup-refresh' }, function (response) {
          console.log('refreshContent:', tabs[0].id);
          console.log('refreshContent response:', response);
          if (
            response &&
            response.type === 'content-data' &&
            response.data &&
            response.fileNamePath
          ) {
            const result = response.data;
            // 初始化数据
            const updateTabsItems: ({ key: string | number; currentAmount: number } & {
              data: any;
            })[] = [];
            // eslint-disable-next-line array-callback-return
            tabsItems.map((item: { key: string | number }) => {
              if (item.key && result && result[item.key]) {
                let currentAmount = result[item.key] && result[item.key].length;
                updateTabsItems.push(
                  Object.assign({}, item, { data: result[item.key], currentAmount })
                );
              }
            });
            let total = 0;
            let tabsObj = {};
            // eslint-disable-next-line array-callback-return
            updateTabsItems.map((item) => {
              total = total + item.currentAmount;
              console.log('total:', total);
              // @ts-ignore
              tabsObj[item.key] = item;
            });
            _self.setState({
              tabsItems: updateTabsItems,
              fileNamePath: response.fileNamePath,
              itemId: response.itemId,
              onePrice: response.onePrice,
              total,
              // @ts-ignore
              currentAmount: tabsObj[activeKey].currentAmount,
            });
          }
        });
    });
  };

  // 获取tab item
  async componentDidMount() {
    console.log('componentDidMount onload');
    const { tabsItems, activeKey } = this.state;
    chrome.storage.local.get(['fixUrl'], (result) => {
      this.setState({
        fixUrl: result.fixUrl,
      });
    });
    if (chrome && chrome.tabs) {
      chrome.tabs.query({ active: true, lastFocusedWindow: true }, (tabs) => {
        console.log('tabs:', tabs);
        if (tabs && tabs[0] && tabs[0].id) {
          chrome.tabs.sendMessage(tabs[0].id, { type: 'popup-refresh' }, (response) => {
            console.log('popup-refresh-res-1:', response);
            if (
              response &&
              response.type === 'content-data' &&
              response.data &&
              response.fileNamePath
            ) {
              const result = response.data;
              // 初始化数据
              const updateTabsItems: ({ key: string | number; currentAmount: number } & {
                data: any;
              })[] = [];
              // eslint-disable-next-line array-callback-return
              tabsItems.map((item: { key: string | number }) => {
                if (item.key && result && result[item.key]) {
                  let currentAmount = result[item.key] && result[item.key].length;
                  updateTabsItems.push(
                    Object.assign({}, item, { data: result[item.key], currentAmount })
                  );
                }
              });
              let total = 0;
              let tabsObj = {};
              // eslint-disable-next-line array-callback-return
              updateTabsItems.map((item) => {
                total = total + item.currentAmount;
                console.log('total:', total);
                // @ts-ignore
                tabsObj[item.key] = item;
              });
              this.setState({
                tabsItems: updateTabsItems,
                fileNamePath: response.fileNamePath,
                itemId: response.itemId,
                onePrice: response.onePrice,
                total,
                // @ts-ignore
                currentAmount: tabsObj[activeKey].currentAmount,
              });
            }
          });
        }
      });
      console.log('onload-refresh', 'componentDidMount');
    }
  }

  // popup-body render html
  popupBodyHtml = () => {
    let html;
    const { activeKey, tabsItems } = this.state;
    const tabsItemsNew = {};

    tabsItems.map((item: { key: string }) => {
      // @ts-ignore
      tabsItemsNew[item.key] = item;
    });
    // @ts-ignore
    const tabData = tabsItemsNew[activeKey];
    console.log('tabData:', tabData);
    switch (activeKey) {
      case 'mian':
        // @ts-ignore
        html = (
          <>
            {tabData && tabData.data[0] && tabData.data[0].msg && (
              <Alert message={'123456'} type="success" showIcon />
            )}
            <ImgItemList
              data={tabData.data}
              itemDownloadEvent={this.itemDownloadEvent}
              openTargeWindow={this.openTargeWindow}
            ></ImgItemList>
          </>
        );
        break;
      case 'detail':
        // @ts-ignore
        html = (
          <>
            {tabData.data[0] && tabData.data[0].msg && (
              <Alert message={tabData.data[0].msg} type="success" showIcon />
            )}
            <ImgItemList
              data={tabData.data}
              itemDownloadEvent={this.itemDownloadEvent}
              openTargeWindow={this.openTargeWindow}
            ></ImgItemList>
          </>
        );
        break;
      case 'sku':
        // @ts-ignore
        html = (
          <>
            {tabData.data[0] && tabData.data[0].msg && (
              <Alert message={tabData.data[0].msg} type="success" showIcon />
            )}
            <ImgItemList
              data={tabData.data}
              itemDownloadEvent={this.itemDownloadEvent}
              openTargeWindow={this.openTargeWindow}
            ></ImgItemList>
          </>
        );
        break;
      case 'video':
        // @ts-ignore
        html = (
          <>
            {tabData.data[0] && tabData.data[0].msg && (
              <Alert message={tabData.data[0].msg} type="success" showIcon />
            )}
            <VideoItemList
              data={tabData.data}
              itemDownloadEvent={this.itemDownloadEvent}
              openTargeWindow={this.openTargeWindow}
            ></VideoItemList>
          </>
        );
        break;
      case 'attr':
        // @ts-ignore
        html = (
          <>
            {tabData.data[0] && tabData.data[0].msg && (
              <Alert message={tabData.data[0].msg} type="success" showIcon />
            )}
            <TxItemList data={tabData.data}></TxItemList>
          </>
        );
        break;
      default:
        // @ts-ignore
        html = (
          <>
            {tabData.data[0] && tabData.data[0].msg && (
              <Alert message={tabData.data[0].msg} type="success" showIcon />
            )}
            <ImgItemList
              data={tabData.data}
              itemDownloadEvent={this.itemDownloadEvent}
              openTargeWindow={this.openTargeWindow}
            ></ImgItemList>
          </>
        );
        break;
    }
    return html;
  };
  handleOk = () => {
    const { access_token, fixUrl } = this.state;
    this.setState(
      {
        isModalOpen: false,
      },
      () => {
        chrome.storage.local.set({ access_token: access_token }, () => {
          console.log('access_token is set to:', access_token);
        });
        // fixUrl
        chrome.storage.local.set({ fixUrl: fixUrl }, () => {
          console.log('fixUrl is set to:', fixUrl);
        });
      }
    );
  };
  handleCancel = () => {
    this.setState({
      isModalOpen: false,
    });
  };
  onChangeTextArea = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    console.log(e);
    const { value } = e.target;
    console.log(value);
    this.setState({
      access_token: value,
    });
  };
  onChangeInput = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { value } = e.target;

    this.setState({
      fixUrl: value,
    });
  };
  render() {
    return (
      <>
        <div className="popup-wrap">
          <div className="popup-header">
            <div className="title">
              <FileSearchOutlined style={{ color: '#1677ff', fontSize: '17px' }} /> 当前页面资源
            </div>
            <div className="file-name">{this.state.fileNamePath}</div>
          </div>
          <div className="popup-tabs">
            <Tabs
              onChange={this.tabsChange}
              defaultActiveKey={this.state.activeKey}
              items={this.state.tabsItems}
            />
          </div>
          <div className="popup-tool">
            <span className="title"></span>
            <span className="dlbox">
              <span>
                <Radio.Group size="small" onChange={this.radioChange} value={this.state.loadType}>
                  <Radio value={1}>全部</Radio>
                  <Radio value={2}>当前</Radio>
                </Radio.Group>
              </span>
              <span className="num">
                {this.state.currentAmount}/{this.state.total}
              </span>
              <span className="refresh">
                <SyncOutlined onClick={this.refreshContent} />
              </span>
              <span>
                <Button
                  size="small"
                  type="primary"
                  onClick={this.downloadEvent}
                  loading={this.state.loading}
                  icon={<DownloadOutlined />}
                >
                  下载
                </Button>
              </span>
            </span>
          </div>
          <div className="popup-body">{this.popupBodyHtml()}</div>
          <div className="popup-footer">
            <span>
              <ExclamationCircleOutlined style={{ color: '#333', fontSize: '20px' }} />
            </span>
            <span>
              <SettingOutlined style={{ color: '#333', fontSize: '20px' }} />
            </span>
            <Button size="small" type="primary" onClick={this.pushDataEvent}>
              Pull Data
            </Button>
            <Button size="small" type="primary" onClick={this.pushDownloadCookies}>
              设置Cookies
            </Button>
          </div>
        </div>
        <Modal
          title="设置 Cookies 信息"
          open={this.state.isModalOpen}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
        >
          <Input onChange={this.onChangeInput} value={this.state.fixUrl}></Input>
          <TextArea
            autoSize={true}
            onChange={this.onChangeTextArea}
            value={this.state.access_token}
          ></TextArea>
        </Modal>
        <Spin spinning={this.state.spinning} fullscreen />
      </>
    );
  }
}

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
  <React.StrictMode>
    <PupupPage taobaoDetail={{ key: 'popup' }} />
  </React.StrictMode>
);
