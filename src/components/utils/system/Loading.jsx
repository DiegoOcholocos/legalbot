export default function Loading() {
  return (
    <div className='absolute right-1/2 bottom-1/2 transform translate-x-1/2 translate-y-1/2 scale-50 '>
      <div className='p-4 bg-gradient-to-tr animate-spin from-primary-400 to-white rounded-full'>
        <div className='dark:bg-black bg-white rounded-full'>
          <div className='w-24 h-24 rounded-full'></div>
        </div>
      </div>
    </div>
  );
}
