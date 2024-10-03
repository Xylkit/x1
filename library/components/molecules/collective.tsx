import Image from "next/image";
import Link from "next/link";

import Card from "@/components/atoms/card";
import { Collective as ICollective } from "@/types";
import { isValidUrl } from "@/utils";

const Collective = ({
  id,
  name,
  description,
  avatarUrl,
  address,
}: ICollective) => (
  <Link href={`/collectives/${id}`}>
    <Card className="h-full transition-shadow hover:shadow-md">
      <div className="flex flex-row items-center gap-4">
        <Image
          src={isValidUrl(avatarUrl) || `https://avatar.vercel.sh/${address}`}
          alt={`${name} logo`}
          width={48}
          height={48}
          className="aspect-[1] rounded-full object-cover"
        />
        <p className="text-lg">{name}</p>
      </div>
      <div>
        <p className="text-sm text-gray-600 line-clamp-2">{description}</p>
      </div>
    </Card>
  </Link>
);

export default Collective;
