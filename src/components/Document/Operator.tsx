import useDocUserApi, { DocUser } from '@/services/docUser';
import {
  ChromeOutlined,
  DeleteOutlined,
  DeploymentUnitOutlined,
  DownloadOutlined,
  EditOutlined,
  EyeOutlined,
  FieldTimeOutlined,
  PushpinOutlined,
  SaveOutlined,
  ShareAltOutlined,
  SignatureOutlined,
  TeamOutlined,
  ToolOutlined,
  UserDeleteOutlined,
  UsergroupDeleteOutlined,
} from '@ant-design/icons';
import { App, Typography } from 'antd';
import { ItemType } from 'antd/es/menu/interface';
import _ from 'lodash';
import { useCallback } from 'react';
import { useStore } from '@/hook/useStore';
import useDocApi from '@/services/doc';
import OnlineUserList from './OnlineUserList';
import { ProForm, ProFormText } from '@ant-design/pro-components';
import IconFillStart from '../Icons/IconFillStar';
import IconStart from '../Icons/IconStar';
import useError from '@/hook/useError';
import Share from './Share';
import { Authentication } from '@/util/constant';
import useToken from '@/hook/useToken';

type OperatorPermission = {
  edit: boolean;
  preview: boolean;
  share: boolean;
  favorite: boolean;
  favor: boolean;
  rename: boolean;
  history: boolean;
  download: boolean;
  delete: boolean;
  kickout: boolean;
  kickoutAll: boolean;
  forceSave: boolean;
  onlineUser: boolean;
};

const useDocumentOperatorEmulator = () => {
  const { message, modal } = App.useApp();
  const { userStore, eventStore } = useStore();
  const { unImplementation } = useError();
  const docApi = useDocApi();
  const docUserApi = useDocUserApi();

  const token = useToken();

  const validator = useCallback(
    (id: DocUser['id'], onSuccess?: Function, onError?: Function) => {
      if (_.isEmpty(id)) {
        message.error('文档信息不完整!');
        onError?.();
      } else {
        onSuccess?.();
      }
    },
    []
  );

  const getCurrentRecordPermission = useCallback(
    (record: DocUser): OperatorPermission => {
      const user = userStore.user;
      return {
        edit: user !== undefined,
        preview: user !== undefined,
        share: user !== undefined,
        favorite: user !== undefined,
        favor: user !== undefined,
        rename: record.creator === user?.userId,
        history: record.creator === user?.userId,
        download: user !== undefined,
        delete: record.creator === user?.userId,
        kickout: record.creator === user?.userId,
        kickoutAll: record.creator === user?.userId,
        forceSave: record.creator === user?.userId,
        onlineUser: record.creator === user?.userId,
      };
    },
    []
  );

  /**
   * get document operator button list of 'view' according to record and permission
   *
   * @param record
   * @param permission
   * @returns
   */
  const getGroupOfView = (
    record: DocUser,
    permission: OperatorPermission
  ): ItemType[] => {
    const viewGroup: ItemType[] = [];

    const { id } = record;
    const OPEN_OF_NEW_WINDOW: ItemType | undefined =
      (permission.edit && {
        key: 'openOfNewWindow',
        label: <Typography.Text>新窗口打开</Typography.Text>,
        icon: <ChromeOutlined />,
        onClick: () => {
          validator(id, () => {
            window.open(
              `/editor/${record.id}?${Authentication}=${token.getToken()}`
            );
          });
        },
      }) ||
      undefined;

    if (OPEN_OF_NEW_WINDOW) {
      viewGroup.push(OPEN_OF_NEW_WINDOW);
    }

    const PREVIEW: ItemType | undefined =
      (permission.preview && {
        key: 'preview',
        label: <Typography.Text>预览</Typography.Text>,
        icon: <EyeOutlined />,
        onClick: () => {
          validator(id, () => {
            window.open(
              `/editor/${
                record.id
              }?preview=true&${Authentication}=${token.getToken()}`
            );
          });
        },
      }) ||
      undefined;
    if (PREVIEW) {
      viewGroup.push(PREVIEW);
    }
    return viewGroup;
  };

  /**
   * get collect operation.
   * contains share, favorite, favor,
   *
   * @param record
   * @param permission
   * @returns
   */
  const getGroupOfCollect = (
    record: DocUser,
    permission: OperatorPermission
  ): ItemType[] => {
    const { id, favor, favorite } = record;
    const collectGroup: ItemType[] = [];

    const SHARE: ItemType | undefined =
      (permission.share && {
        key: 'share',
        label: <Typography.Text>分享</Typography.Text>,
        icon: <ShareAltOutlined />,
        onClick: () => {
          modal.confirm({
            icon: null,
            closable: true,
            title: '分享',
            footer: null,
            style: { padding: 0 },
            content: <Share docId={id} />,
          });
        },
      }) ||
      undefined;
    if (SHARE) {
      collectGroup.push(SHARE);
    }

    const FAVORITE: ItemType | undefined =
      (permission.favorite &&
        (favorite === true
          ? {
              key: 'cancelFavorite',
              label: <Typography.Text>取消收藏</Typography.Text>,
              icon: <IconFillStart width='1em' height='1em' />,
              onClick: () => {
                validator(id, () => {
                  docUserApi.cancelFavoriteDocument(id).then((res) => {
                    const { code, data } = res;
                    if (code === 200 && data) {
                      message.success('取消收藏成功!');
                      eventStore.onRefresh();
                    } else {
                      message.error('修改失败!');
                    }
                  });
                });
              },
            }
          : {
              key: 'favorite',
              label: <Typography.Text>收藏</Typography.Text>,
              icon: <IconStart width='1em' height='1em' />,
              onClick: () => {
                validator(id, () => {
                  docUserApi.favoriteOfDocument(id).then((res) => {
                    const { code, data } = res;
                    if (code === 200 && data) {
                      message.success('收藏成功!');
                      eventStore.onRefresh();
                    } else {
                      message.error(res.message);
                    }
                  });
                });
              },
            })) ||
      undefined;

    if (FAVORITE) {
      collectGroup.push(FAVORITE);
    }

    const FAVOR: ItemType | undefined =
      (permission.favor &&
        (favor === true
          ? {
              key: 'cancelFavor',
              label: <Typography.Text>取消固定</Typography.Text>,
              icon: <PushpinOutlined />,
              onClick: () => {
                validator(id, () => {
                  docUserApi.cancelFavorOfDocument(id).then((res) => {
                    const { code, data } = res;
                    if (code === 200 && data) {
                      message.success('取消固定成功!');
                      eventStore.onRefresh();
                    } else {
                      message.error('修改失败!');
                    }
                  });
                });
              },
            }
          : {
              key: 'favor',
              label: <Typography.Text>固定为常用</Typography.Text>,
              icon: <PushpinOutlined />,
              onClick: () => {
                validator(id, () => {
                  docUserApi.favorOfDocument(id).then((res) => {
                    const { code, data } = res;
                    if (code === 200 && data) {
                      message.success('固定为常用成功!');
                      eventStore.onRefresh();
                    } else {
                      message.error('修改失败!');
                    }
                  });
                });
              },
            })) ||
      undefined;

    if (FAVOR) {
      collectGroup.push(FAVOR);
    }
    return collectGroup;
  };

  /**
   * get document modify operation
   * contains: rename, history
   *
   * @param record
   * @param permission
   * @returns
   */
  const getGroupOfDocModify = (
    record: DocUser,
    permission: OperatorPermission
  ): ItemType[] => {
    const { id, type } = record;
    const docModifyGroup: ItemType[] = [];

    const RENAME: ItemType | undefined =
      (permission.rename && {
        key: 'rename',
        label: <Typography.Text>重命名</Typography.Text>,
        icon: <EditOutlined />,
        onClick: () => {
          const modalRef = modal.confirm({
            icon: null,
            closable: true,
            footer: true,
            title: '重命名',
            content: (
              <div className='p-1'>
                <ProForm<{ title: string }>
                  onFinish={async (values) => {
                    docApi
                      .rename(id, {
                        newfilename: values.title,
                        ext: '.' + type,
                      })
                      .then((res) => {
                        const { code, success } = res;
                        if (code === 200 && success) {
                          message.success('修改成功!');
                          eventStore.onRefresh();
                          modalRef.destroy();
                        } else {
                          message.error('修改失败!');
                        }
                      });
                  }}
                >
                  <ProFormText
                    name='title'
                    label='文档名称'
                    placeholder='请输入不超过64个字文档名称!'
                    rules={[
                      { required: true, message: '请输入文档名称!' },
                      { min: 1 },
                      { max: 64 },
                    ]}
                  />
                </ProForm>
              </div>
            ),
          });
        },
      }) ||
      undefined;

    if (RENAME) {
      docModifyGroup.push(RENAME);
    }

    const HISTORY: ItemType | undefined =
      (permission.history && {
        key: 'history',
        label: <Typography.Text>历史版本</Typography.Text>,
        icon: <FieldTimeOutlined />,
      }) ||
      undefined;

    if (HISTORY) {
      docModifyGroup.push(HISTORY);
    }
    return docModifyGroup;
  };

  /**
   * get online document operation
   * contains: kickout, kickout all, force save, online user
   *
   * @param record
   * @param permission
   */
  const getGroupOfOnlineDoc = (
    record: DocUser,
    permission: OperatorPermission
  ) => {
    const { id } = record;
    const onlineGroup: ItemType[] = [];

    const KICKOUT: ItemType | undefined =
      (permission.kickout && {
        key: 'kickout',
        label: <Typography.Text>踢出</Typography.Text>,
        icon: <UserDeleteOutlined />,
        onClick: () => {
          modal.confirm({
            title: '正在编辑的用户',
            icon: null,
            closable: true,
            footer: null,
            content: (
              <div className='p-1'>
                <OnlineUserList
                  docId={id}
                  operation={[
                    {
                      icon: <UserDeleteOutlined />,
                      text: '踢出',
                      type: 'dashed',
                      size: 'small',
                      onClick(record, api) {
                        docUserApi.kickout(id, [record.userId]).then((res) => {
                          const { code, success } = res;
                          if (code === 200 && success) {
                            api.refresh();
                            message.success('踢出成功!');
                          } else {
                            message.error('踢出失败!');
                          }
                        });
                      },
                    },
                  ]}
                />
              </div>
            ),
          });
        },
      }) ||
      undefined;

    if (KICKOUT) {
      onlineGroup.push(KICKOUT);
    }

    const KICKOUT_ALL: ItemType | undefined =
      (permission.kickoutAll && {
        key: 'kickoutAll',
        label: <Typography.Text>踢出所有人</Typography.Text>,
        icon: <UsergroupDeleteOutlined />,
        onClick: () => {
          modal.confirm({
            content: '是否要踢出所有人!',
            okText: '确定',
            cancelText: '取消',
            onOk() {
              docUserApi.kickoutAll(id).then((res) => {
                const { code, data } = res;
                if (code === 200 && data) {
                  message.success('踢出成功!');
                  eventStore.onRefresh();
                } else {
                  message.error('提出失败!');
                }
              });
            },
          });
        },
      }) ||
      undefined;

    if (KICKOUT_ALL) {
      onlineGroup.push(KICKOUT_ALL);
    }

    const FORCE_SAVE: ItemType | undefined =
      (permission.forceSave && {
        key: 'forceSave',
        label: <Typography.Text>强制保存</Typography.Text>,
        icon: <SaveOutlined />,
        onClick: () => {
          modal.confirm({
            content: '是否要强制保存!',
            okText: '确定',
            cancelText: '取消',
            onOk() {
              docApi.forceSave(id).then((res) => {
                const { code, data } = res;
                if (code === 200 && data) {
                  message.success('强制保存成功!');
                  eventStore.onRefresh();
                } else {
                  message.error('强制保存失败');
                }
              });
            },
          });
        },
      }) ||
      undefined;

    if (FORCE_SAVE) {
      onlineGroup.push(FORCE_SAVE);
    }

    const ONLINE_USER: ItemType | undefined =
      (permission.onlineUser && {
        key: 'onlineUser',
        label: <Typography.Text>正在编辑的用户</Typography.Text>,
        icon: <TeamOutlined />,
        onClick: () => {
          modal.confirm({
            title: '正在编辑的用户',
            icon: null,
            closable: true,
            footer: null,
            content: <OnlineUserList docId={id} />,
          });
        },
      }) ||
      undefined;

    if (ONLINE_USER) {
      onlineGroup.push(ONLINE_USER);
    }
    return onlineGroup;
  };

  /**
   * get document edit operation
   * contains: download, delete, exit share
   *
   * @param record
   * @param permission
   * @returns
   */
  const getGroupOfEdit = (
    record: DocUser,
    permission: OperatorPermission
  ): ItemType[] => {
    const { id } = record;
    const docEditGroup: ItemType[] = [];
    const DOWNLOAD: ItemType | undefined =
      (permission.download && {
        key: 'download',
        label: '下载',
        icon: <DownloadOutlined />,
        onClick: () => {
          validator(id, () => {
            window.open(
              `/api/office/v1/doc/download/${id}?${Authentication}=${token.getToken()}`
            );
          });
        },
      }) ||
      undefined;
    if (DOWNLOAD) {
      docEditGroup.push(DOWNLOAD);
    }
    const DELETE: ItemType | undefined =
      (permission.delete && {
        key: 'delete',
        label: <Typography.Text type='danger'>移除记录</Typography.Text>,
        icon: <DeleteOutlined />,
        onClick: () => {
          modal.confirm({
            content: '是否要移除文档?',
            okText: '确定',
            cancelText: '取消',
            onOk() {
              docApi.remove([id]).then((res) => {
                const { code, data } = res;
                if (code === 200 && data) {
                  message.success('删除成功!');
                  eventStore.onRefresh();
                } else {
                  message.error(res.message);
                }
              });
            },
          });
        },
      }) ||
      undefined;
    if (DELETE) {
      docEditGroup.push(DELETE);
    }
    return docEditGroup;
  };

  return {
    loadOperatorList: (record: DocUser): ItemType[] => {
      const permission = getCurrentRecordPermission(record);

      const divider: ItemType = { type: 'divider' };
      const docOperatorList: ItemType[] = [];

      const viewGroup = getGroupOfView(record, permission);
      docOperatorList.push(...viewGroup);
      docOperatorList.push(divider);

      const collectGroup = getGroupOfCollect(record, permission);

      collectGroup.length > 0 &&
        docOperatorList.push({
          key: 'collect',
          type: 'submenu',
          label: '收集',
          icon: <DeploymentUnitOutlined />,
          children: collectGroup,
        });
      docOperatorList.push(divider);

      const docModifyGroup = getGroupOfDocModify(record, permission);

      docModifyGroup.length > 0 &&
        docOperatorList.push({
          key: 'modify',
          type: 'submenu',
          label: '文档修改',
          icon: <SignatureOutlined />,
          children: docModifyGroup,
        });
      docOperatorList.push(divider);

      const onlineGroup = getGroupOfOnlineDoc(record, permission);

      onlineGroup.length > 0 &&
        docOperatorList.push({
          key: 'online',
          type: 'submenu',
          label: '文档操作',
          icon: <ToolOutlined />,
          children: onlineGroup,
        });
      docOperatorList.push(divider);

      const docEditGroup = getGroupOfEdit(record, permission);
      docOperatorList.push(...docEditGroup);
      return docOperatorList;
    },
  };
};

export default useDocumentOperatorEmulator;
