import {UpdateTextPayloadDto} from './dto/payloads/update-text-payload.dto';
import {UpdateVideoPayloadDto} from './dto/payloads/update-video-payload.dto';
import {UpdateQuotePayloadDto} from './dto/payloads/update-quote-payload.dto';
import {UpdatePhotoPayloadDto} from './dto/payloads/update-photo-payload.dto';
import {UpdateLinkPayloadDto} from './dto/payloads/update-link-payload.dto';
import {AvailablePostType} from "./blog-post.constant";
import {PostType} from "@project/core";

export function patchPayloadByType(
  type: PostType,
  prevPayload: Record<string, any>,
  patch: UpdateTextPayloadDto | UpdateVideoPayloadDto | UpdateQuotePayloadDto | UpdatePhotoPayloadDto | UpdateLinkPayloadDto,
  photoId?: string
): Record<string, any> {
  switch (type) {
    case AvailablePostType.TEXT: {
      const p = patch as UpdateTextPayloadDto;
      return {
        title: p.title ?? prevPayload.title,
        announce: p.announce ?? prevPayload.announce,
        text: p.text ?? prevPayload.text,
      };
    }

    case AvailablePostType.VIDEO: {
      const p = patch as UpdateVideoPayloadDto;
      return {
        title: p.title ?? prevPayload.title,
        videoUrl: p.videoUrl ?? prevPayload.videoUrl,
      };
    }

    case AvailablePostType.QUOTE: {
      const p = patch as UpdateQuotePayloadDto;
      return {
        text: p.text ?? prevPayload.text,
        author: p.author ?? prevPayload.author,
      };
    }

    case AvailablePostType.PHOTO: {
      const p = patch as UpdatePhotoPayloadDto;
      return {
        title: p.title ?? prevPayload.title,
        fileId: photoId ?? prevPayload.fileId,
      };
    }

    case AvailablePostType.LINK: {
      const p = patch as UpdateLinkPayloadDto;
      return {
        url: p.url ?? prevPayload.url,
        description: p.description ?? prevPayload.description,
      };
    }

    default:
      throw new Error(`Неподдерживаемый тип поста: ${type}`);
  }
}
