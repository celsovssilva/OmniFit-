package com.example.backend.repository;

import com.example.backend.entity.AvaliacoesFisicas;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface AvaliacoesFisicasRepository extends JpaRepository<AvaliacoesFisicas,Long> {
    List<AvaliacoesFisicas> findByAlunoIdOrderByDataDesc(Long alunoId);
}
