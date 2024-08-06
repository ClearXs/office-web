import { App } from 'antd';

const useError = () => {
  const { message } = App.useApp();

  return {
    unImplementation: () => {
      message.error('该功能还未实现,尽情期待❗');
    },
  };
};

export default useError;
