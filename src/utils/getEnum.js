import { useEffect, useState } from 'react';
import fetch from './fetch';

export default function GetEnum(url, key = null) {
  const [data, setData] = useState(null);

  useEffect(() => {
    const getData = async () => {
      const response = await fetch.get(url).catch((e) => {
        console.log(e);
      });
      if (response.ok) {
        setData(response.data);
      }
    };
    getData();
  }, [url, key]);

  return data;
}
