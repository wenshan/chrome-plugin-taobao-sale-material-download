import { Image } from 'antd';
import { DownloadOutlined, ExportOutlined } from '@ant-design/icons';

function ImgItemList(props: { data: any; itemDownloadEvent: any; openTargeWindow: any }) {
  console.log('ImgItemList-props:', props);
  const { data, itemDownloadEvent, openTargeWindow } = props;
  return (
    <div className="item">
      <ul>
        {data &&
          data.length > 0 &&
          data.map((item: any) => (
            <li key={item.title}>
              <div className="box">
                <Image width={200} src={item.src}></Image>
              </div>
              <div className="title">{item.title}</div>
              <div className="footer">
                <span className="imgsize">{item.size}</span>
                <span className="right">
                  <span className="imgformat">{item.format}</span>
                  <span className="imgexport">
                    <ExportOutlined
                      style={{ color: '#66666', fontSize: '14px' }}
                      onClick={() => {
                        openTargeWindow(item);
                      }}
                    />
                  </span>
                  <span className="imgdownload">
                    <DownloadOutlined
                      style={{ color: '#666666', fontSize: '18px' }}
                      onClick={() => {
                        itemDownloadEvent(item);
                      }}
                    />
                  </span>
                </span>
              </div>
            </li>
          ))}
      </ul>
    </div>
  );
}

export default ImgItemList;
