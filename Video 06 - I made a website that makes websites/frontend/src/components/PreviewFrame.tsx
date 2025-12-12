import { WebContainer } from '@webcontainer/api';
import { useEffect, useState } from 'react';

interface PreviewFrameProps {
  files: any[];
  webContainer?: WebContainer;
}

export function PreviewFrame({ files, webContainer }: PreviewFrameProps) {
  // In a real implementation, this would compile and render the preview
  const [url, setUrl] = useState("");
  console.log("WebContainer in PreviewFrame", webContainer);

  async function main() {
    const installProcess = await webContainer?.spawn('npm', ['install']);

    installProcess?.output.pipeTo(new WritableStream({
      write(data) {
        //console.log(data);
      }
    }));

    await webContainer?.spawn('npm', ['run', 'dev']);

    console.log("Started dev server");
    // Wait for `server-ready` event
    webContainer?.on('server-ready', (port, url) => {
      // ...
      console.log(url)
      console.log(port)
      setUrl(url);
    });
    console.log("Listening for server-ready event", url);

    
  }

  console.log(url)
  useEffect(() => {
    main()
  }, [webContainer]);
  return (
    <div className="h-full flex items-center justify-center text-gray-400">
      {!url && <div className="text-center">
        <p className="mb-2">Loading...</p>
      </div>}
      {url && <iframe width={"100%"} height={"100%"} src={url} />}
    </div>
  );
}