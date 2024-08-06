'use client';

import useDocUserApi, { OnlineDocUser } from '@/services/docUser';
import { UserOutlined } from '@ant-design/icons';
import { App, List, Space, Tooltip } from 'antd';
import { BaseButtonProps } from 'antd/es/button/button';
import { Button, TooltipProps } from 'antd/lib';
import _ from 'lodash';
import { useCallback, useEffect, useMemo, useState } from 'react';

export type OperationButton = BaseButtonProps & {
  tooltip?: TooltipProps;
  onClick?: (record: OnlineDocUser, api: OnlineUserListApi) => void;
  text?: string;
};

export type IOnlineUserListProps = {
  docId: string;
  operation?: OperationButton[];
  getOnlineUserListApi?: (api: OnlineUserListApi) => void;
};

export type OnlineUserListApi = {
  refresh: () => void;
};

const OnlineUserList: React.FC<IOnlineUserListProps> = ({
  docId,
  operation,
  getOnlineUserListApi,
}) => {
  const { message } = App.useApp();
  const docUserApi = useDocUserApi();
  const [onlineUsers, setOnlineUsers] = useState<OnlineDocUser[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const selectOnlineDocUser = useCallback(() => {
    setLoading(true);
    docUserApi
      .getOnlineDocUser(docId)
      .then((res) => {
        const { code, data } = res;
        if (code === 200) {
          setOnlineUsers(data);
        } else {
          message.error(res.message);
        }
      })
      .finally(() => {
        setLoading(false);
      });
  }, [docId]);

  const api = useMemo<OnlineUserListApi>(() => {
    return {
      refresh() {
        selectOnlineDocUser();
      },
    };
  }, [docId]);

  useEffect(() => {
    selectOnlineDocUser();
    getOnlineUserListApi?.(api);
  }, [docId]);

  return (
    <div className='p-2'>
      <List<OnlineDocUser>
        loading={loading}
        dataSource={onlineUsers}
        itemLayout='horizontal'
        renderItem={(item) => {
          return (
            <List.Item
              actions={(operation || []).map((o, i) => {
                const { tooltip, onClick, text, ...props } = o;
                if (tooltip) {
                  return (
                    <Tooltip {...tooltip} key={i}>
                      <Button
                        {...props}
                        onClick={() => {
                          onClick?.(item, api);
                        }}
                      >
                        {text}
                      </Button>
                    </Tooltip>
                  );
                } else {
                  return (
                    <Button
                      key={i}
                      {...props}
                      onClick={() => {
                        onClick?.(item, api);
                      }}
                    >
                      {text}
                    </Button>
                  );
                }
              })}
            >
              <Space>
                <UserOutlined />
                <div>{item.userName}</div>
              </Space>
            </List.Item>
          );
        }}
      ></List>
    </div>
  );
};

export default OnlineUserList;
