'use client';

import { DocType } from '@/services/doc';
import useDocUserApi, {
  DocUser,
  DocUserApi,
  DocUserParams,
} from '@/services/docUser';
import { IPage } from '@/services/model/interface';
import {
  App,
  Button,
  Dropdown,
  Space,
  Table,
  TableProps,
  Tooltip,
  Typography,
} from 'antd';
import { observer } from 'mobx-react-lite';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useMemo, useState } from 'react';
import IconDocx from '../Icons/IconDocx';
import IconXlsx from '../Icons/IconXlsx';
import IconPpt from '../Icons/IconPpt';
import {
  EllipsisOutlined,
  PaperClipOutlined,
  ShareAltOutlined,
} from '@ant-design/icons';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import _ from 'lodash';
import { useStore } from '@/hook/useStore';
import useDocumentOperatorEmulator from './Operator';
import IconStart from '../Icons/IconStar';
import IconFillStart from '../Icons/IconFillStar';
import useError from '@/hook/useError';

export type IDocumentListProps = {
  api:
    | DocUserApi['getMineCreateDocument']
    | DocUserApi['getMineFavorDocument']
    | DocUserApi['getMineFavoriteDocument']
    | DocUserApi['getMineRecentlyDocument']
    | DocUserApi['getShareToMeDocument'];
};

export const chooseDocumentIcon = (docType: DocType | undefined) => {
  if (docType === 'doc' || docType === 'docx') {
    return <IconDocx width='1.5em' height='1.5em' />;
  } else if (docType === 'xls' || docType === 'xlsx') {
    return <IconXlsx width='1.5em' height='1.5em' />;
  } else if (docType === 'ppt' || docType === 'pptx') {
    return <IconPpt width='1.5em' height='1.5em' />;
  } else {
    return undefined;
  }
};

type ColumnsType<T extends object> = TableProps<T>['columns'];

type TablePage = Pick<IPage<DocUser>, 'current' | 'size' | 'total'>;

const DocumentList = observer(({ api }: IDocumentListProps) => {
  const documentOperatorEmulator = useDocumentOperatorEmulator();

  const { unImplementation } = useError();
  const { userStore, eventStore, documentStore } = useStore();
  const docUserApi = useDocUserApi();

  const [loading, setLoading] = useState<boolean>(false);
  const [tablePage, setTablePage] = useState<TablePage>({
    current: 1,
    size: 10,
    total: 0,
  });

  const { message } = App.useApp();

  const [params, setParams] = useState<DocUserParams>();
  const [docUserList, setDocUserList] = useState<DocUser[]>([]);

  const router = useRouter();

  const [itemMouseMoveKey, setItemMouseMoveKey] = useState<string | undefined>(
    undefined
  );

  const [copyEditorUrl, setCopyEditorUrl] = useState<string>('');

  const formatFileSize = useCallback((bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }, []);

  const selectDocUserList = (params: DocUserParams) => {
    setLoading(true);
    api(params)
      .then((res) => {
        const { code, data } = res;
        if (code === 200) {
          const { size, current, total, records } = data;
          setTablePage({ size, current, total });
          setDocUserList(records);
        }
      })
      .catch((err) => {
        message.error(err?.data?.message);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    selectDocUserList({ ...(params || {}), ...tablePage } as DocUserParams);
    return () => {
      documentStore.setSelectDocumentRows([]);
      setItemMouseMoveKey(undefined);
    };
  }, [eventStore.counter]);

  const columns: ColumnsType<DocUser> = useMemo(() => {
    return [
      {
        title: '名称',
        dataIndex: 'title',
        key: 'title',
        width: '40%',
        filters: [
          {
            text: (
              <Space>
                <IconDocx width='12px' height='12px' />
                <Typography.Text>文字</Typography.Text>
              </Space>
            ),
            value: 'docx',
          },
          {
            text: (
              <Space>
                <IconXlsx width='12px' height='12px' />
                <Typography.Text>表格</Typography.Text>
              </Space>
            ),
            value: 'xlsx',
          },
          {
            text: (
              <Space>
                <IconPpt width='12px' height='12px' />
                <Typography.Text>演示</Typography.Text>
              </Space>
            ),
            value: 'pptx',
          },
        ],
        render: (_, record) => {
          const { title, type, id, favorite } = record;
          return (
            <div
              className='hover:bg-[#f0f0f0] flex items-center rounded-md'
              onMouseMove={() => {
                itemMouseMoveKey === undefined &&
                  setItemMouseMoveKey(record.id);
              }}
              onMouseLeave={() => {
                setItemMouseMoveKey(undefined);
              }}
            >
              <Button
                type='link'
                size='large'
                onClick={() => {
                  window.open(`/editor/${id}`);
                }}
              >
                <Space>
                  {type && chooseDocumentIcon(type)}
                  <Typography.Text
                    className='hover:text-[#4096ff] text-left'
                    style={{ maxWidth: '9rem' }}
                    ellipsis={{ tooltip: { title } }}
                  >
                    {title}
                  </Typography.Text>
                </Space>
              </Button>
              {itemMouseMoveKey === id && favorite === true && (
                <Tooltip title='取消收藏'>
                  <Button
                    icon={<IconFillStart width='1.3em' height='1.3em' />}
                    onClick={() => {
                      docUserApi.cancelFavoriteDocument(id).then((res) => {
                        const { code, data } = res;
                        if (code === 200 && data) {
                          message.success('取消收藏成功!');
                          eventStore.onRefresh();
                        } else {
                          message.error(res.message);
                        }
                      });
                    }}
                  />
                </Tooltip>
              )}
              {itemMouseMoveKey === id &&
                (favorite === false || favorite === undefined) && (
                  <Tooltip title='收藏'>
                    <Button
                      icon={<IconStart width='1.3em' height='1.3em' />}
                      onClick={() => {
                        docUserApi.favoriteOfDocument(id).then((res) => {
                          const { code, data } = res;
                          if (code === 200 && data) {
                            message.success('收藏成功!');
                            eventStore.onRefresh();
                          } else {
                            message.error(res.message);
                          }
                        });
                      }}
                    />
                  </Tooltip>
                )}
              {itemMouseMoveKey === id && (
                <div className='ml-auto pr-2'>
                  <Space>
                    <Tooltip title='分享'>
                      <Button
                        icon={<ShareAltOutlined />}
                        onClick={() => unImplementation()}
                      />
                    </Tooltip>
                    <CopyToClipboard text={copyEditorUrl}>
                      <Tooltip title='复制链接'>
                        <Button
                          icon={<PaperClipOutlined />}
                          onClick={() => {
                            const location = window.location;
                            const editorUrl = location.origin + `/editor/${id}`;
                            message.success({
                              content: (
                                <>
                                  <Typography.Text>
                                    已复制链接🎉
                                  </Typography.Text>
                                </>
                              ),
                            });
                            setCopyEditorUrl(editorUrl);
                          }}
                        />
                      </Tooltip>
                    </CopyToClipboard>
                  </Space>
                </div>
              )}
            </div>
          );
        },
      },
      {
        title: '所有者',
        dataIndex: 'createName',
        key: 'createName',
        render: (_, record) => {
          const currentUserId = userStore.user?.id;
          if (record.creator === currentUserId) {
            return <Typography.Text>我</Typography.Text>;
          }
          return <Typography.Text>{record.createName}</Typography.Text>;
        },
      },
      {
        title: '版本号',
        dataIndex: 'version',
        key: 'version',
      },
      {
        title: '最后修改',
        dataIndex: 'updateTime',
        key: 'updateTime',
      },
      {
        title: '大小',
        dataIndex: 'age',
        key: 'age',
        render: (_, record) => {
          try {
            const fileJson = JSON.parse(record.file);
            if (fileJson && Array.isArray(fileJson)) {
              return (
                fileJson.length > 0 &&
                formatFileSize(Number(fileJson[0]['fileSize']))
              );
            }
          } catch (err) {
            console.error(err);
          }
          return '-';
        },
      },
      {
        key: 'action',
        render: (_, record) => {
          const operatorList =
            documentOperatorEmulator.loadOperatorList(record);
          return (
            <Dropdown
              menu={{
                items: operatorList,
              }}
            >
              <Button
                icon={<EllipsisOutlined />}
                onClick={(e) => e.stopPropagation()}
                type='dashed'
              />
            </Dropdown>
          );
        },
      },
    ];
  }, [itemMouseMoveKey]);

  return (
    <Table
      rowKey='id'
      loading={loading}
      bordered={false}
      columns={columns}
      dataSource={docUserList}
      scroll={{ y: '70vh' }}
      onChange={(pagination, filter, sorter) => {
        // clear select document
        documentStore.setSelectDocumentRows([]);
        const tablePage: TablePage = {
          current: pagination.current,
          size: pagination.pageSize,
        };
        // set to document type params from table title filters
        const typeArray = filter['title'] as string[];
        const params = {} as DocUserParams;
        if (!_.isEmpty(typeArray)) {
          if (typeArray.includes('docx') && !typeArray.includes('doc')) {
            typeArray.push('doc');
          }
          if (typeArray.includes('xlsx') && !typeArray.includes('xls')) {
            typeArray.push('xls');
          }
          if (typeArray.includes('pptx') && !typeArray.includes('ppt')) {
            typeArray.push('ppt');
          }
          params.type = typeArray;
        }
        selectDocUserList({ ...tablePage, ...params });
      }}
      pagination={{
        current: tablePage.current,
        pageSize: tablePage.size,
        total: tablePage.total,
      }}
      rowSelection={{
        selectedRowKeys: documentStore.selectDocumentRows.map((doc) => doc.id),
        onChange: (_, selectRows) => {
          documentStore.setSelectDocumentRows(selectRows);
        },
      }}
    />
  );
});

export default DocumentList;
