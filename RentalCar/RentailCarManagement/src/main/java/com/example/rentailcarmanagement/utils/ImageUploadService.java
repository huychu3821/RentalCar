package com.example.rentailcarmanagement.utils;

import com.google.auth.Credentials;
import com.google.auth.oauth2.GoogleCredentials;
import com.google.cloud.storage.BlobId;
import com.google.cloud.storage.BlobInfo;
import com.google.cloud.storage.Storage;
import com.google.cloud.storage.StorageOptions;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.util.Objects;
import java.util.UUID;

@Component
public class ImageUploadService {

    Logger logger = LoggerFactory.getLogger(ImageUploadService.class);

    private File convertToFile(MultipartFile multipartFile, String fileName) throws IOException {
        File tempFile = new File(fileName);
        try (FileOutputStream fos = new FileOutputStream(tempFile)) {
            fos.write(multipartFile.getBytes());
        }
        return tempFile;
    }

    private String uploadFile(File file, String fileName) throws IOException {
        BlobId blobId = BlobId.of("rentail-car-management.appspot.com", fileName);
        BlobInfo blobInfo = BlobInfo.newBuilder(blobId).setContentType("media").build();
        InputStream inputStream = ImageUploadService.class.getClassLoader()
                .getResourceAsStream("rentail-car-management-firebase-adminsdk-ctpuz-c9ba5514e4.json");
        assert inputStream != null;
        Credentials credentials = GoogleCredentials.fromStream(inputStream);
        Storage storage = StorageOptions.newBuilder()
                .setCredentials(credentials)
                .build()
                .getService();
        storage.create(blobInfo, Files.readAllBytes(file.toPath()));

        String DOWNLOAD_URL = "https://firebasestorage.googleapis.com/v0/b/<bucket-name>/o/%s?alt=media";
        return String.format(DOWNLOAD_URL, URLEncoder.encode(fileName, StandardCharsets.UTF_8));
    }

    public String upload(MultipartFile multipartFile) throws IOException {
        String getMultipartFileName = multipartFile.getOriginalFilename();
        String fileName = UUID.randomUUID().toString().concat(Objects.requireNonNull(getMultipartFileName).substring(getMultipartFileName.lastIndexOf(".")));// to generated random string values for file name.

        File file = this.convertToFile(multipartFile, fileName);                      // to convert multipartFile to File
        String contentFormat = this.uploadFile(file, fileName);// to get uploaded file link
        logger.info(contentFormat);
        file.delete();
        return file.getPath();
    }

    public void deleteFile(String fileName) throws IOException {
        InputStream inputStream = ImageUploadService.class
                .getClassLoader()
                .getResourceAsStream("rentail-car-management-firebase-adminsdk-ctpuz-c9ba5514e4.json");

        if (inputStream != null) {
            Credentials credentials = GoogleCredentials.fromStream(inputStream);
            Storage storage = StorageOptions.newBuilder()
                    .setCredentials(credentials)
                    .build().getService();

            BlobId blobId = BlobId.of("rentail-car-management.appspot.com", fileName);
            storage.delete(blobId);
        }
    }
}
