import { Image, Checkbox } from 'antd';
import { DownloadOutlined, ExportOutlined } from '@ant-design/icons';

function ImgItemList(props: { data: any }) {
  console.log('ImgItemList-props:', props);
  const { data } = props;
  return (
    <div className="item">
      <ul>
        {data &&
          data.map((item: any) => (
            <li>
              <div className="box">
                <Image width={200} src={item.src}></Image>
                <span className="checkbox">
                  <Checkbox></Checkbox>
                </span>
              </div>
              <div className="title">{item.title}</div>
              <div className="footer">
                <span className="imgsize">{item.size}</span>
                <span className="right">
                  <span className="imgformat">{item.format}</span>
                  <span className="imgexport">
                    <ExportOutlined style={{ color: '#66666', fontSize: '14px' }} />
                  </span>
                  <span className="imgdownload">
                    <DownloadOutlined style={{ color: '#666666', fontSize: '18px' }} />
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
