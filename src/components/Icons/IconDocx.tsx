import { IconComponentProps } from '@ant-design/icons/lib/components/Icon';

const DocxSvg = (props: IconComponentProps) => {
  return (
    <svg
      viewBox='0 0 1024 1024'
      version='1.1'
      xmlns='http://www.w3.org/2000/svg'
      p-id='2650'
      {...props}
    >
      <path
        d='M967.111111 281.6V910.222222c0 62.577778-51.2 113.777778-113.777778 113.777778H170.666667c-62.577778 0-113.777778-51.2-113.777778-113.777778V113.777778c0-62.577778 51.2-113.777778 113.777778-113.777778h514.844444L967.111111 281.6z'
        fill='#4F6BF6'
        p-id='2651'
      ></path>
      <path
        d='M581.262222 755.626667h59.363556L739.555556 439.04h-59.335112z'
        fill='#FFFFFF'
        p-id='2652'
      ></path>
      <path
        d='M685.511111 224.711111V0L967.111111 281.6H742.4c-31.288889 0-56.888889-25.6-56.888889-56.888889'
        fill='#243EBB'
        p-id='2653'
      ></path>
      <path
        d='M640.625778 755.626667h-59.363556l-98.929778-277.020445h59.335112zM442.737778 755.626667h-59.363556L284.444444 439.04h59.335112z'
        fill='#FFFFFF'
        p-id='2654'
      ></path>
      <path
        d='M383.374222 755.626667h59.363556l98.929778-277.020445h-59.335112z'
        fill='#FFFFFF'
        p-id='2655'
      ></path>
    </svg>
  );
};

export default function IconDocx(props: IconComponentProps) {
  return <DocxSvg {...props} />;
}
